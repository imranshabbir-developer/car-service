# API Fetch Error Troubleshooting Guide

## 🔍 Error: "Failed to fetch"

This error occurs when the browser cannot reach the API server. Here are common causes and solutions:

---

## Common Causes

### 1. **CORS (Cross-Origin Resource Sharing) Error** ⚠️
**Symptom:** Network request blocked by browser

**Check:**
- Open browser DevTools → Network tab
- Look for CORS error messages
- Check if the request shows "CORS policy" error

**Solution:**
- Verify backend CORS configuration includes your frontend domain
- Check `backend-rent-car/server.js` - `allowedOrigins` array
- Make sure your frontend URL is in the list

### 2. **API Server Not Running** ⚠️
**Symptom:** Connection refused or timeout

**Check:**
- Is the backend server running?
- Can you access `https://api.convoytravels.pk/api/v1/health` directly?

**Solution:**
- Start the backend server
- Check if the API URL is correct in `config/api.js`

### 3. **Network/SSL Issues** ⚠️
**Symptom:** SSL certificate errors or network timeouts

**Check:**
- Is the SSL certificate valid?
- Is the domain pointing to the correct server?

**Solution:**
- Verify SSL certificate is valid
- Check DNS settings
- Test API endpoint directly in browser/Postman

### 4. **Wrong API URL** ⚠️
**Symptom:** 404 Not Found or connection refused

**Check:**
- Verify `API_BASE_URL` in `config/api.js`
- Make sure it matches your backend URL

**Current Configuration:**
```javascript
const API_BASE_URL = 'https://api.convoytravels.pk/api/v1';
```

---

## 🔧 Quick Fixes

### Fix 1: Check API Configuration

**File:** `car-service/config/api.js`

**For Production:**
```javascript
const API_BASE_URL = 'https://api.convoytravels.pk/api/v1';
const API_IMAGE_BASE_URL = 'https://api.convoytravels.pk';
```

**For Local Development:**
```javascript
// const API_BASE_URL = 'https://api.convoytravels.pk/api/v1';
// const API_IMAGE_BASE_URL = 'https://api.convoytravels.pk';

const API_BASE_URL = 'http://localhost:5000/api/v1';
const API_IMAGE_BASE_URL = 'http://localhost:5000';
```

### Fix 2: Verify Backend CORS

**File:** `backend-rent-car/server.js`

Make sure your frontend domain is in the `allowedOrigins` array:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://convoytravels.pk',  // ✅ Your production frontend
  'https://api.convoytravels.pk',  // ✅ If needed
  // Add other domains as needed
];
```

### Fix 3: Test API Directly

**Test in browser:**
```
https://api.convoytravels.pk/api/v1/health
```

**Test with curl:**
```bash
curl https://api.convoytravels.pk/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Fix 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for detailed error messages
4. Go to **Network** tab
5. Check the failed request:
   - Status code
   - Response headers
   - Error message

---

## 🐛 Debugging Steps

### Step 1: Check API URL
```javascript
// In browser console
console.log('API URL:', 'https://api.convoytravels.pk/api/v1/cars');
```

### Step 2: Test API Endpoint
Open in browser:
```
https://api.convoytravels.pk/api/v1/cars
```

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Refresh page
3. Find the failed request
4. Check:
   - Request URL
   - Status code
   - Response (if any)
   - Error message

### Step 4: Check CORS Headers
In Network tab, check the failed request:
- Look for `Access-Control-Allow-Origin` header
- If missing, it's a CORS issue

---

## ✅ Improved Error Handling

The components now have better error handling:

1. **Checks response.ok** before parsing JSON
2. **Logs API URL** for debugging
3. **Shows detailed error messages**
4. **Falls back gracefully** to default data

---

## 🔍 Common Error Messages

### "Failed to fetch"
- **Cause:** Network error, CORS, or server not reachable
- **Fix:** Check API URL, CORS config, server status

### "CORS policy: No 'Access-Control-Allow-Origin' header"
- **Cause:** Backend not allowing your frontend origin
- **Fix:** Add frontend domain to `allowedOrigins` in backend

### "NetworkError when attempting to fetch resource"
- **Cause:** Server not running or wrong URL
- **Fix:** Verify backend is running and URL is correct

### "404 Not Found"
- **Cause:** Wrong API endpoint
- **Fix:** Check API route path

### "500 Internal Server Error"
- **Cause:** Backend server error
- **Fix:** Check backend logs

---

## 📋 Checklist

Before reporting the error, check:

- [ ] Backend server is running
- [ ] API URL is correct in `config/api.js`
- [ ] Frontend domain is in backend CORS `allowedOrigins`
- [ ] SSL certificate is valid (for HTTPS)
- [ ] Network connectivity is working
- [ ] Browser console shows detailed error
- [ ] API endpoint works when tested directly

---

## 🚀 Quick Test

Run this in browser console to test API:

```javascript
fetch('https://api.convoytravels.pk/api/v1/health')
  .then(res => res.json())
  .then(data => console.log('✅ API Working:', data))
  .catch(err => console.error('❌ API Error:', err));
```

If this works, the API is accessible. If not, check the error message for details.

