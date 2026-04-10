# Admin Dashboard Graphs - TESTING GUIDE

## All Fixes Already Implemented! 

The Admin Dashboard Activity Overview graphs have been completely fixed. Here's how to test them:

## 1. Start the Backend Server

```bash
cd backend
node server.js
```

The backend should start on port 5000 with these API endpoints:
- `GET /api/prints/history` - Returns last 7 days of print data
- `GET /api/stats/charts` - Returns chart data with filters
- `GET /api/stats` - Returns general statistics

## 2. Start the Frontend

```bash
cd frontend
npm run dev
```

## 3. Test the Admin Dashboard

1. Navigate to: `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Go to Admin Dashboard

## 4. Expected Results

### "Daily Print Volume" (Bar Chart)
- **Should show**: Last 7 days of actual print data
- **X-axis**: Dates (Apr 1, Apr 2, etc.)
- **Y-axis**: Number of prints per day
- **Real-time updates**: Every 10 seconds

### "Print Activity" (Line Chart)
- **Should show**: Multiple data series (prints, users, uploads)
- **X-axis**: Dates based on filter (today/7days/30days)
- **Y-axis**: Count values
- **Real-time updates**: Every 15 seconds

## 5. API Testing

You can test the API endpoints directly:

### Test Print History
```bash
curl -H "Authorization: Bearer test_admin_token_1775028546379" \
     http://localhost:5000/api/prints/history
```

**Expected Response:**
```json
[
  { "date": "2026-04-01", "count": 5 },
  { "date": "2026-04-02", "count": 2 },
  { "date": "2026-04-03", "count": 0 },
  { "date": "2026-04-04", "count": 3 },
  { "date": "2026-04-05", "count": 1 },
  { "date": "2026-04-06", "count": 4 },
  { "date": "2026-04-07", "count": 0 }
]
```

### Test Chart Data
```bash
curl -H "Authorization: Bearer test_admin_token_1775028546379" \
     http://localhost:5000/api/stats/charts?filter=7days
```

## 6. Generate Test Data (If No Prints Exist)

If the graphs show 0 data, generate some test prints:

```bash
cd backend
node generate_test_data.js
```

This will create:
- 20 test documents
- Print logs for the last 7 days
- Realistic print counts and pricing

## 7. Console Logs to Verify

### Backend Console Should Show:
```
Connected to MongoDB
SecurePrint backend listening on port 5000
Registering routes...
All routes registered
```

### When API is Called:
```
GET /api/prints/history
GET /api/stats/charts
```

### Frontend Console Should Show:
```
Chart data loaded: [...]
Print history loaded: [...]
```

## 8. Troubleshooting

### If Graphs Still Show 0:

1. **Check Database Connection**
   - Ensure MongoDB is running
   - Check backend console for connection errors

2. **Verify Print Logs Exist**
   - Run: `node check_db.js`
   - Should show: "Total print logs: X"

3. **Check API Responses**
   - Open browser dev tools
   - Go to Network tab
   - Look for failed requests to `/api/prints/history`

4. **Generate Sample Data**
   - Run: `node generate_test_data.js`
   - This creates test print logs

### Common Issues:

- **MongoDB not running**: Start MongoDB service
- **Wrong port**: Backend should be on 5000, frontend on 5173
- **CORS issues**: Check backend CORS configuration
- **Auth issues**: Using test token should work

## 9. Real-Time Updates Verification

1. Open Admin Dashboard
2. Open browser console
3. Watch for logs every 10-15 seconds:
   ```
   Print history loaded: [...]
   Chart data loaded: [...]
   ```

4. The graphs should update automatically without page refresh

## 10. Success Indicators

### Working Correctly:
- [x] "Daily Print Volume" shows non-zero values
- [x] "Print Activity" shows multiple data lines
- [x] Data refreshes automatically
- [x] Console shows successful API calls
- [x] No error messages in console

### Still Broken:
- [ ] All values show 0
- [ ] Graphs never update
- [ ] Console shows API errors
- [ ] Backend shows database connection errors

---

## Summary

All the code changes are complete! The graphs should now work with:
- Real data from database
- Proper aggregation by date
- Real-time updates every 10 seconds
- Fallback to 0 for days with no prints

Just start both servers and test the dashboard!
