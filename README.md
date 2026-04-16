# Gainer Groceries - Online Supermarket

A complete e-commerce website for Gainer Groceries, your online supermarket in Harare, Zimbabwe.

## 🚀 Deployment

This project is configured for **Netlify** deployment with automatic optimization.

### Quick Deploy (Recommended)
1. Go to [Netlify](https://netlify.com)
2. Drag and drop this entire project folder onto the deployment area
3. Your site will be live in minutes at `https://your-site-name.netlify.app`

### Alternative: GitHub + Netlify
1. Push this code to a GitHub repository
2. Connect your repository to Netlify
3. Enable automatic deployments on every push

### Deployment Configuration
- ✅ `netlify.toml` configured for optimal performance
- ✅ Security headers enabled
- ✅ Image caching optimized
- ✅ URL redirects configured
- ✅ Build settings optimized for static sites

## Features

### 🏪 Core E-commerce Functionality
- **Product Catalog**: Organized by categories (Pantry, Breakfast, Snacks, Toiletries, Household, Baby Products, Frozen)
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout Process**: Complete order flow with multiple payment options
- **Order Management**: Track and process customer orders
- **Stock Management**: Handle in-stock and "available on request" items

### 📱 Customer Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Search & Filter**: Find products quickly by name or category
- **WhatsApp Integration**: Direct ordering via WhatsApp
- **Delivery Information**: Clear delivery fees and policies
- **Payment Options**: Cash (USD/ZWL) and EcoCash

### 🛠️ Business Management
- **Admin Dashboard**: Complete backend management system
- **Product Management**: Add, edit, delete products
- **Order Processing**: View and update order status
- **Business Settings**: Configure delivery fees, minimum orders, etc.
- **Analytics**: Track daily orders and revenue

### 📋 Legal & Compliance
- **Terms & Conditions**: Comprehensive terms of service
- **Privacy Policy**: Customer data protection
- **Refund & Returns**: Clear return policies
- **Delivery Policy**: Detailed delivery terms

## Business Model

### Hybrid Stock System
- **In Stock Items**: Available for immediate delivery
- **On Request Items**: Sourced per order with extended delivery time

### Delivery Service
- **Area**: Harare, Zimbabwe only
- **Timing**: Orders by 7PM for next-day delivery
- **Fees**: $3-$7 based on order value (free over $50)
- **Minimum Order**: $20

### Payment Methods
- **Cash on Delivery**: USD or ZWL
- **EcoCash**: Mobile money transfer

## File Structure

```
gainer-groceries/
├── index.html              # Main website
├── legal-pages.html        # Terms, Privacy, Returns, Delivery policies
├── admin.html             # Admin dashboard
├── styles.css             # Complete styling
├── script.js              # Frontend functionality
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Modern web browser
- Web server (optional for local development)

### Local Development
1. Clone or download the project files
2. Open `index.html` in your web browser
3. For admin access, open `admin.html`

### Production Deployment
1. Upload all files to your web server
2. Ensure your domain is pointed to the correct directory
3. Test all functionality before going live

## Customization

### Business Information
Update the following in `script.js`:
- WhatsApp number: `263774899928`
- Business contact details
- Product catalog and pricing

### Styling
Modify `styles.css` to:
- Change colors (currently green theme)
- Adjust fonts and spacing
- Customize layout components

### Products
Edit the `products` array in `script.js` to:
- Add new products
- Update prices
- Change stock status
- Modify categories

## Admin Dashboard Features

### Dashboard Overview
- Today's orders and revenue
- Total product count
- Pending orders
- Recent order summary

### Order Management
- View all orders with details
- Update order status (Pending → Processing → Delivered)
- Search orders by customer or ID
- Print order receipts

### Product Management
- Add new products
- Edit existing products
- Delete products
- Update stock status
- Search and filter products

### Business Settings
- Configure business name and contact
- Set minimum order amount
- Adjust delivery fees
- Update order cut-off time

## WhatsApp Integration

The website includes two WhatsApp features:
1. **Quick Order Button**: Direct WhatsApp chat for general inquiries
2. **Cart to WhatsApp**: Convert shopping cart to WhatsApp message

WhatsApp number: `263774899928` (can be changed in script.js)

## Responsive Design

The website is fully responsive with:
- **Desktop**: Full-featured layout with sidebar cart
- **Tablet**: Optimized touch interactions
- **Mobile**: Compact layout with slide-out cart

## Browser Compatibility

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Considerations

- No server-side processing (static website)
- Customer data handled via WhatsApp (secure)
- No payment processing on website
- Admin dashboard should be password-protected in production

## Performance Optimization

- Lightweight CSS and JavaScript
- Optimized images (use WebP format)
- Minimal external dependencies
- Fast loading times

## Future Enhancements

Consider adding:
- User accounts and order history
- Online payment integration
- Product reviews and ratings
- Email notifications
- Inventory management system
- Delivery tracking
- Loyalty program

## Support

For technical support or questions:
- WhatsApp: 0774899928
- Email: support@gainergroceries.co.zw

## License

This project is proprietary to Gainer Groceries. All rights reserved.

---

**Gainer Groceries**  
Your Online Supermarket in Harare, Zimbabwe  
*Convenient grocery shopping, delivered to your door*
