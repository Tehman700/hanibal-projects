import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
}

interface Product {
  id: number;
  name: string;
  price: string;
  original_price: string;
  image: string;
  description: string;
  category: string;
  is_hot: boolean;
  is_new: boolean;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        if (response.ok) {
          const data: Product[] = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products for search:', error);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    // Debounce search
    const timeoutId = setTimeout(() => {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, products]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToFooter = () => {
    if (location.pathname === '/') {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const scrollToNewsletter = () => {
    if (location.pathname === '/') {
      const newsletter = document.querySelector('#newsletter1') as HTMLElement | null;
      newsletter?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const newsletter = document.querySelector('#newsletter1') as HTMLElement | null;
        newsletter?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleProductClick = (productId: number) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '') {
      setShowSearchResults(true);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" className="w-[167px] h-36" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-pokemon-dark hover:text-pokemon-red transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-pokemon-dark hover:text-pokemon-red transition-colors"
            >
              Products
            </Link>
            <button
              onClick={scrollToFooter}
              className="text-pokemon-dark hover:text-pokemon-red transition-colors"
            >
              About
            </button>
            <button
              onClick={scrollToNewsletter}
              className="text-pokemon-dark hover:text-pokemon-red transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden sm:block relative" ref={searchRef}>
              <div className="flex items-center bg-pokemon-gray rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  className="bg-transparent ml-2 outline-none text-sm w-32 lg:w-48"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-pokemon-blue"></div>
                      <span className="ml-2 text-sm text-gray-600">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-4 text-left transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <h4 className="text-base font-medium text-gray-900 leading-tight">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {product.category}
                            </p>
                            <p className="text-base font-semibold text-pokemon-blue">
                              ${product.price}
                            </p>
                          </div>
                        </button>
                      ))}

                      {searchResults.length === 8 && (
                        <div className="px-4 py-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                              setShowSearchResults(false);
                              setSearchQuery('');
                            }}
                            className="text-sm text-pokemon-blue hover:text-pokemon-red transition-colors"
                          >
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="relative"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ShoppingCart className="w-6 h-6 text-pokemon-dark hover:text-pokemon-red transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pokemon-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-pokemon-dark" />
              ) : (
                <Menu className="w-6 h-6 text-pokemon-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative" ref={searchRef}>
                <div className="flex items-center bg-pokemon-gray rounded-lg px-3 py-2 mb-4">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    className="bg-transparent ml-2 outline-none text-sm w-full"
                  />
                </div>

                {/* Mobile Search Results */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50 mb-4">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-pokemon-blue"></div>
                        <span className="ml-2 text-sm text-gray-600">Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              handleProductClick(product.id);
                              setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 text-left transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {product.category}
                              </p>
                              <p className="text-sm font-medium text-pokemon-blue">
                                ${product.price}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="text-pokemon-dark hover:text-pokemon-red transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-pokemon-dark hover:text-pokemon-red transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/pre-orders"
                className="text-pokemon-dark hover:text-pokemon-red transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pre-Orders
              </Link>
              <button
                onClick={() => {
                  scrollToFooter();
                  setIsMenuOpen(false);
                }}
                className="text-pokemon-dark hover:text-pokemon-red transition-colors py-2 cursor-pointer text-left w-full"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToNewsletter();
                  setIsMenuOpen(false);
                }}
                className="text-pokemon-dark hover:text-pokemon-red transition-colors py-2 cursor-pointer text-left w-full"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;