# Improved Backend Logging System

## What's Been Improved

### 1. **Authentication Logging** 
- **Login Attempts**: Tracks IP address, User-Agent, and email (masked)
- **User Lookup**: Logs when users are found/not found
- **Password Validation**: Logs success/failure of password checks
- **JWT Generation**: Tracks token creation for specific users
- **Complete Login Flow**: End-to-end tracking of authentication

### 2. **Request/Response Logging**
- **All Incoming Requests**: Method, URL, IP, User-Agent, timestamp
- **Request Bodies**: Logged for POST/PUT/PATCH (with sensitive data masked)
- **Response Status**: Status codes and response timing
- **Client IP Tracking**: For security and debugging

### 3. **Collection/Wantlist Operations**
- **User-Specific Requests**: Tracks which user is accessing data
- **Data Retrieval**: Logs number of items retrieved
- **DAO Operations**: Database query execution tracking

### 4. **JWT Operations**
- **Token Generation**: User-specific token creation
- **Token Verification**: Success/failure of token validation
- **Error Handling**: Detailed error logging for failed operations

## Log Format Examples

### Authentication Flow:
```
[AUTH][authenticateUser] Login attempt from IP: 172.18.0.1
[AUTH][authenticateUser] Email: tes***
[AUTH][authenticateUser] User found - ID: 1, Username: pskills
[AUTH][authenticateUser][SUCCESS] Password validated for user: pskills (ID: 1)
[JWT][generateToken] Creating token for user: pskills (ID: 1)
[AUTH][authenticateUser][SUCCESS] Login completed successfully for: pskills (ID: 1)
```

### Request/Response Flow:
```
[REQUEST][2025-09-27T01:50:00.000Z] GET /api/users/1/collection - IP: 172.18.0.1
[COLLECTION][readCollection] Request for user ID: 1 from IP: 172.18.0.1
[DAO][readCollection] Executing query for user ID: 1
[COLLECTION][readCollection] Successfully retrieved 15 collection items for user ID: 1
[RESPONSE][2025-09-27T01:50:00.100Z] GET /api/users/1/collection - Status: 200
```

### Error Handling:
```
[AUTH][authenticateUser][FAILED] Invalid password for user: pskills (ID: 1)
[WANTLIST][readWantlist][ERROR] Failed to fetch wantlist for user ID: 1: Error details...
```

## Benefits

1. **Security**: Track login attempts, failed authentications, and suspicious activity
2. **Debugging**: Detailed request flow makes troubleshooting easier
3. **Performance**: Monitor response times and identify bottlenecks
4. **User Tracking**: Know exactly what each user is doing
5. **Audit Trail**: Complete record of all API operations

## Testing the Logs

To see the improved logging in action:
1. Try logging in with different credentials
2. Access collection/wantlist pages
3. Watch the backend logs with: `docker logs -f discogs-api`

The logs now provide much better visibility into who is signing in and what they're doing!

