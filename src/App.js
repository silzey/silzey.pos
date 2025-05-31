import React, { useState, useEffect } from "react"; // Import useEffect

const categories = ["Flower", "Concentrates", "Vapes", "Edibles"];

const placeholderImages: Record<string, string[]> = {
  Flower: [
    "https://images.pexels.com/photos/7667726/pexels-photo-7667726.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
    "https://images.pexels.com/photos/7667760/pexels-photo-7667760.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
  ],
  Concentrates: [
    "https://images.pexels.com/photos/7667727/pexels-photo-7667727.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
    "https://images.pexels.com/photos/7667723/pexels-photo-7667723.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
  ],
  Vapes: [
    "https://images.pexels.com/photos/4041323/pexels-photo-4041323.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
    "https://images.pexels.com/photos/3738934/pexels-photo-3738934.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
  ],
  Edibles: [
    "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=150&w=200",
  ],
};

const generateProducts = (category: string) =>
  Array.from({ length: 100 }, (_, i) => ({
    id: `${category}-${i + 1}`,
    name: `${category} Product ${i + 1}`,
    image: placeholderImages[category][i % placeholderImages[category].length],
    price: (Math.random() * 50 + 10).toFixed(2),
    tags: ["Organic", "Hybrid", "Indica", "Sativa"][i % 4],
    rating: (Math.random() * 5).toFixed(1), // rating 0.0 - 5.0
  }));

type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  tags: string;
  rating: string;
};

type CartItem = Product & { quantity: number };

export default function App() {
  const [showSplash, setShowSplash] = useState(true); // New state for splash screen
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [sortOption, setSortOption] = useState("A-Z");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [viewCart, setViewCart] = useState(false);
  const [viewCheckout, setViewCheckout] = useState(false); // New state for checkout modal
  const [showThankYouCard, setShowThankYouCard] = useState(false); // New state for thank you card
  const [message, setMessage] = useState(""); // New state for user messages/errors

  // Customer form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rewardsPoints, setRewardsPoints] = useState(0); // New state for rewards

  // useEffect to manage splash screen visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []); // Run only once on component mount

  let products = generateProducts(activeCategory);

  // Filter by tag
  if (selectedTag) {
    products = products.filter((p) => p.tags === selectedTag);
  }

  // Filter by search term (case insensitive)
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(term));
  }

  // Sort
  if (sortOption === "A-Z") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "Price") {
    products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  // Add to cart or increase quantity if already exists
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from cart completely
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Change quantity in cart
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const totalPrice = cart
    .reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  // Handle checkout confirmation
  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty. Please add items before checking out.");
      return;
    }
    setMessage(""); // Clear any previous messages
    setViewCart(false); // Close cart modal
    setViewCheckout(true); // Open checkout modal
  };

  const finalizeSale = () => {
    if (!firstName || !lastName || !dob || !phoneNumber) {
      setMessage("Please fill in all customer information fields."); // Set message for validation
      return;
    }

    const pointsEarned = Math.floor(parseFloat(totalPrice));
    setRewardsPoints((prevPoints) => prevPoints + pointsEarned);

    // Using a custom modal or message box instead of alert()
    console.log(
      `Sale finalized for ${firstName} ${lastName}!\nTotal: $${totalPrice}\nPoints Earned: ${pointsEarned}\nTotal Rewards Points: ${
        rewardsPoints + pointsEarned
      }`
    );

    // Reset everything after sale
    setCart([]);
    setFirstName("");
    setLastName("");
    setDob("");
    setPhoneNumber("");
    setRewardsPoints(0); // Reset rewards points for the next customer
    setViewCheckout(false);
    setMessage(""); // Clear message on successful finalization

    // Show thank you card and then reload page after 10 seconds
    setShowThankYouCard(true);
    setTimeout(() => {
      window.location.reload(); // Reloads the entire page
    }, 10000); // 10 seconds
  };

  // Helper to display stars for rating (rounded)
  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const halfStar = ratingNum - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar && "⯨"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  // Conditional rendering for the splash screen
  if (showSplash) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#1a1a1d", // Dark background for splash
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999, // Ensure it's on top of everything
          color: "#fff",
          fontSize: "3em", // Large font size
          fontWeight: "bold",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          animation: "fadeIn 0.5s ease-out", // Simple fade-in animation
        }}
      >
        Silzey POS
        {/* You can add a logo or loading spinner here if you wish */}
      </div>
    );
  }

  // Conditional rendering for the thank you card
  if (showThankYouCard) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.8)", // Semi-transparent dark overlay
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999, // Ensure it's on top of everything
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 40,
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            animation: "modalFadeIn 0.5s ease-out forwards",
            maxWidth: "90%",
            width: "500px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 32, color: "#28a745" }}>
            Thank You!
          </h2>
          <p style={{ fontSize: 20, color: "#1d1d1f" }}>
            Your order is being processed.
          </p>
          <p style={{ fontSize: 16, color: "#6e6e73" }}>
            This page will reset shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        // backgroundColor: "#f5f5f7", // Background is now on body in index.html
        minHeight: "100vh",
        color: "#1d1d1f", // Dark text for contrast
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: 32,
          marginBottom: 20,
          fontWeight: 700,
        }}
      >
        Cannabis Catalog
      </h1>

      {/* Cart Button */}
      <div
        className="cart-button"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "#fff",
          padding: "10px 15px",
          borderRadius: 20, // More rounded for Apple feel
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // Softer shadow
          zIndex: 1100,
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "background 0.2s ease", // Smooth transition for hover
          border: "1px solid #e5e5ea", // Subtle border
        }}
        onClick={() => setViewCart(true)}
        aria-label="Open cart"
        tabIndex={0}
      >
        <span
          role="img"
          aria-label="Shopping cart icon"
          style={{ fontSize: 20 }}
        >
          🛒
        </span>
        <strong style={{ fontSize: 16, color: "#0071e3" }}>
          Cart ({cart.reduce((a, i) => a + i.quantity, 0)})
        </strong>
      </div>

      {/* Categories */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 30, // Increased margin for more breathing room
          gap: 12, // Increased gap between buttons
        }}
        aria-label="Product categories"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setVisibleCount(12);
              setSelectedTag("");
              setSearchTerm("");
            }}
            className={activeCategory === category ? "category-button-active" : "category-button-default"}
            style={{
              padding: "10px 20px",
              borderRadius: 24,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 15,
              transition: "background-color 0.2s ease, color 0.2s ease, transform 0.1s ease",
            }}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Filters and Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginBottom: 30, // Increased margin
          flexWrap: "wrap",
        }}
      >
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 12, // More rounded
            border: "1px solid #d1d1d6", // Subtle border
            backgroundColor: "#fff",
            fontSize: 15,
            minWidth: 150,
            appearance: "none", // Remove default select arrow
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236e6e73'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, // Custom arrow
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px",
            cursor: "pointer",
            outline: "none", // Remove default focus outline
          }}
          aria-label="Sort products"
        >
          <option value="A-Z">Sort: A-Z</option>
          <option value="Price">Sort: Price</option>
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 12,
            border: "1px solid #d1d1d6",
            backgroundColor: "#fff",
            fontSize: 15,
            minWidth: 150,
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236e6e73'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px",
            cursor: "pointer",
            outline: "none",
          }}
          aria-label="Filter by tag"
        >
          <option value="">All Tags</option>
          <option value="Organic">Organic</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Indica">Indica</option>
          <option value="Sativa">Sativa</option>
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input" // Add a class name
          style={{
            padding: "10px 15px",
            borderRadius: 12,
            border: "1px solid #d1d1d6",
            backgroundColor: "#fff",
            minWidth: 220,
            fontSize: 15,
            outline: "none", // Remove default focus outline
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)", // Inner shadow for depth
          }}
          aria-label="Search products"
        />
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // Slightly larger min-width
          gap: 20, // Increased gap
          maxWidth: 1400, // Wider max-width
          margin: "0 auto",
        }}
      >
        {products.length === 0 && (
          <p
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              color: "#6e6e73",
              fontSize: 18,
            }}
          >
            No products found matching your criteria.
          </p>
        )}
        {products.slice(0, visibleCount).map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="product-grid-button" // Add a class name
            style={{
              border: "none",
              background: "#fff",
              borderRadius: 16, // More rounded corners
              padding: 16, // More padding
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)", // Softer, more pronounced shadow
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 10, // Increased gap
              transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth transitions
            }}
            aria-label={`View details for ${product.name}`}
          >
            <img
              src={product.image.replace("h=150&w=200", "h=200&w=300")} // Adjust image size
              alt={product.name}
              style={{
                borderRadius: 12,
                objectFit: "cover",
                width: "100%",
                height: 180,
              }} // Consistent rounding
              loading="lazy"
            />
            <div>
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: 18, // Slightly larger font
                  fontWeight: 600,
                  color: "#1d1d1f",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </h3>
              <p
                style={{ margin: "0 0 6px 0", color: "#6e6e73", fontSize: 14 }}
              >
                {product.tags}
              </p>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#333",
                }}
              >
                ${product.price}
              </p>
              <p
                aria-label={`${product.rating} stars rating`}
                style={{ margin: 0, color: "#ff9f00", fontSize: 15 }}
              >
                {renderStars(product.rating)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {visibleCount < products.length && (
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button
            onClick={handleLoadMore}
            className="load-more-button" // Add a class name
            style={{
              padding: "12px 24px",
              borderRadius: 24,
              border: "none",
              backgroundColor: "#0071e3",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 16,
              transition: "background-color 0.2s ease, transform 0.1s ease",
            }}
          >
            Load More
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 20,
            backdropFilter: "blur(5px)", // Frosted glass effect
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 24, // More rounded for modals
              maxWidth: 550, // Slightly wider
              width: "100%",
              padding: 30, // More padding
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)", // More pronounced shadow
              display: "flex",
              flexDirection: "column",
              gap: 20,
              animation: "modalFadeIn 0.3s ease-out forwards", // Simple fade-in animation
            }}
          >
            <h2
              id="modal-title"
              style={{ margin: 0, fontSize: 24, fontWeight: 700 }}
            >
              {selectedProduct.name}
            </h2>
            <img
              src={selectedProduct.image.replace("h=150&w=200", "h=350&w=500")}
              alt={selectedProduct.name}
              style={{
                borderRadius: 16,
                width: "100%",
                objectFit: "cover",
                maxHeight: 350,
              }}
              loading="lazy"
            />
            <p style={{ margin: 0, fontSize: 16, color: "#6e6e73" }}>
              <strong style={{ color: "#1d1d1f" }}>Tags:</strong>{" "}
              {selectedProduct.tags}
            </p>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 22,
                color: "#333",
              }}
            >
              Price: ${selectedProduct.price}
            </p>
            <p
              aria-label={`${selectedProduct.rating} stars rating`}
              style={{ margin: 0, color: "#ff9f00", fontSize: 18 }}
            >
              {renderStars(selectedProduct.rating)}
            </p>

            <button
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null);
              }}
              className="add-to-cart-button" // Add a class name
              style={{
                padding: "14px 0",
                backgroundColor: "#0071e3",
                borderRadius: 20,
                border: "none",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 18,
                transition: "background-color 0.2s ease, transform 0.1s ease",
              }}
            >
              Add to Cart
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              className="close-modal-button" // Add a class name
              style={{
                marginTop: 8,
                padding: "12px 0",
                borderRadius: 20,
                border: "1px solid #0071e3",
                backgroundColor: "transparent",
                color: "#0071e3",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 16,
                transition: "background-color 0.2s ease, color 0.2s ease, transform 0.1s ease",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {viewCart && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
            padding: 20,
            backdropFilter: "blur(8px)", // Stronger blur for cart
          }}
          onClick={() => setViewCart(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 24,
              maxWidth: 650, // Wider for cart
              width: "100%",
              maxHeight: "85vh", // Taller for more items
              overflowY: "auto",
              padding: 30,
              display: "flex",
              flexDirection: "column",
              gap: 20, // Increased gap
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              animation: "modalSlideIn 0.3s ease-out forwards", // Slide-in animation for cart
            }}
          >
            <h2
              id="cart-title"
              style={{
                margin: 0,
                textAlign: "center",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              Your Cart
            </h2>

            {cart.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  marginTop: 40,
                  fontSize: 18,
                  color: "#6e6e73",
                }}
              >
                Your cart is empty. Start adding some products!
              </p>
            ) : (
              <>
                {cart.map((item, index) => ( // Added index for conditional styling
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 15, 
                      alignItems: "center",
                      borderBottom: index === cart.length - 1 ? "none" : "1px solid #eee", // No border for last item
                      paddingBottom: 15,
                      paddingTop: 5, 
                    }}
                  >
                    <img
                      src={item.image.replace("h=150&w=200", "h=80&w=80")} 
                      alt={item.name}
                      style={{
                        borderRadius: 12,
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </h4>
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          color: "#6e6e73",
                          fontSize: 14,
                        }}
                      >
                        {item.tags}
                      </p>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>
                        ${item.price} each
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8, 
                        minWidth: 120, 
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <button
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => updateQuantity(item.id, -1)}
                          className="quantity-button" 
                          style={{
                            fontSize: 20, 
                            width: 32,
                            height: 32,
                            borderRadius: 8, 
                            border: "1px solid #d1d1d6",
                            background: "#f0f0f5",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "background 0.2s ease, transform 0.1s ease",
                          }}
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          aria-atomic="true"
                          style={{
                            minWidth: 24,
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => updateQuantity(item.id, 1)}
                          className="quantity-button" 
                          style={{
                            fontSize: 20,
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: "1px solid #d1d1d6",
                            background: "#f0f0f5",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "background 0.2s ease, transform 0.1s ease",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="remove-from-cart-button" 
                        style={{
                          marginTop: 6,
                          fontSize: 14,
                          color: "#d9534f", 
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "color 0.2s ease",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 25, 
                    fontWeight: 700,
                    fontSize: 22, 
                    textAlign: "right",
                    borderTop: "1px solid #ddd",
                    paddingTop: 15,
                    color: "#1d1d1f",
                  }}
                  aria-live="polite"
                >
                  Total: ${totalPrice}
                </div>

                <button
                  onClick={handleCheckout} 
                  className="proceed-to-checkout-button" 
                  style={{
                    marginTop: 20,
                    padding: "14px 0",
                    backgroundColor: "#0071e3",
                    borderRadius: 20,
                    border: "none",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 18,
                    transition: "background-color 0.2s ease, transform 0.1s ease",
                  }}
                >
                  Proceed to Checkout
                </button>
              </>
            )}

            <button
              onClick={() => setViewCart(false)}
              className="close-cart-button" 
              style={{
                marginTop: 18, 
                padding: "12px 0",
                borderRadius: 20,
                border: "1px solid #0071e3",
                backgroundColor: "transparent",
                color: "#0071e3",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 16,
                transition: "background-color 0.2s ease, color 0.2s ease, transform 0.1s ease",
              }}
            >
              Close Cart
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {viewCheckout && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300, 
            padding: 20,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setViewCheckout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 24,
              maxWidth: 700, 
              width: "100%",
              maxHeight: "90vh", 
              overflowY: "auto",
              padding: 30,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              animation: "modalSlideIn 0.3s ease-out forwards",
            }}
          >
            <h2
              id="checkout-title"
              style={{
                margin: 0,
                textAlign: "center",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              Complete Your Purchase
            </h2>

            {message && (
              <div style={{ color: '#d9534f', textAlign: 'center', marginBottom: 10, fontSize: 16, fontWeight: 600 }}>
                {message}
              </div>
            )}

            <div
              style={{
                backgroundColor: "#e0f0ff", 
                borderRadius: 12,
                padding: 15,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 600,
                color: "#0071e3",
              }}
            >
              Current Rewards Points: {rewardsPoints}
            </div>

            <h3 style={{ margin: "10px 0 0 0", fontSize: 22, fontWeight: 600 }}>
              Order Summary
            </h3>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px dotted #ddd",
                  paddingBottom: 10,
                  paddingTop: 5,
                }}
              >
                <span style={{ fontSize: 16, color: "#1d1d1f" }}>
                  {item.name} (x{item.quantity})
                </span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 24,
                marginTop: 15,
                paddingTop: 15,
                borderTop: "2px solid #0071e3",
              }}
            >
              <span>Grand Total:</span>
              <span>${totalPrice}</span>
            </div>

            <h3 style={{ margin: "20px 0 10px 0", fontSize: 22, fontWeight: 600 }}>
              Customer Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 15,
              }}
            >
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  padding: "10px 15px",
                  borderRadius: 12,
                  border: "1px solid #d1d1d6",
                  fontSize: 16,
                  outline: "none",
                }}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  padding: "10px 15px",
                  borderRadius: 12,
                  border: "1px solid #d1d1d6",
                  fontSize: 16,
                  outline: "none",
                }}
                required
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{
                  padding: "10px 15px",
                  borderRadius: 12,
                  border: "1px solid #d1d1d6",
                  fontSize: 16,
                  outline: "none",
                }}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  padding: "10px 15px",
                  borderRadius: 12,
                  border: "1px solid #d1d1d6",
                  fontSize: 16,
                  outline: "none",
                }}
                required
              />
            </div>

            <button
              onClick={finalizeSale}
              className="finalize-sale-button" 
              style={{
                marginTop: 30,
                padding: "16px 0",
                backgroundColor: "#28a745", 
                borderRadius: 20,
                border: "none",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 20,
                transition: "background-color 0.2s ease, transform 0.1s ease",
              }}
            >
              Finalize Sale
            </button>
            <button
              onClick={() => setViewCheckout(false)}
              className="cancel-checkout-button" 
              style={{
                marginTop: 10,
                padding: "12px 0",
                borderRadius: 20,
                border: "1px solid #0071e3",
                backgroundColor: "transparent",
                color: "#0071e3",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 16,
                transition: "background-color 0.2s ease, color 0.2s ease, transform 0.1s ease",
              }}
            >
              Cancel Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
