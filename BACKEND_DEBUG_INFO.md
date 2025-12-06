# Backend Debugging Information - 504 Error on Programmes Endpoint

## Issue Summary

**Endpoint**: `GET /programmes/?page=1&page_size=10`  
**Error**: `504 Gateway Timeout`  
**Full URL**: `https://api.ihsaanacademia.com/programmes/?page=1&page_size=10`  
**Status**: Request times out before backend responds

---

## Request Details

### Frontend Implementation

- **File**: `utils/redux/slices/programmeSlice.jsx`
- **Method**: `fetchProgrammes`
- **HTTP Method**: `GET`
- **Base URL**: `https://api.ihsaanacademia.com` (from http2 instance)
- **Endpoint Path**: `/programmes/`
- **Query Parameters**:
  - `page=1`
  - `page_size=10`

### Request Headers

- `Authorization: Bearer <token>` (if authenticated)
- `Content-Type: application/json`

### Expected Response (from IhsaanLms.yaml)

According to the API specification:

- **Endpoint**: `GET /programmes/`
- **Operation ID**: `programmes_list`
- **Response**: Paginated list with structure:
  ```json
  {
    "count": <integer>,
    "results": [<Programme objects>],
    "next": <string|null>,
    "previous": <string|null>
  }
  ```

---

## Possible Backend Issues

### 1. **Database Query Performance**

- **Issue**: Slow or inefficient database query
- **Check**:
  - Database query execution time
  - Missing database indexes on programmes table
  - N+1 query problems (loading related data inefficiently)
  - Large dataset without proper pagination

### 2. **Related Data Loading**

- **Issue**: Loading too much related data (e.g., courses, students) for each programme
- **Check**:
  - Serializer includes too many nested relationships
  - Prefetch/select_related not optimized
  - Circular relationships causing infinite loops

### 3. **Server Resource Constraints**

- **Issue**: Server CPU/Memory overloaded
- **Check**:
  - Server resource usage (CPU, RAM)
  - Number of concurrent requests
  - Database connection pool exhaustion

### 4. **Timeout Configuration**

- **Issue**: Gateway timeout too short for the operation
- **Check**:
  - Gateway timeout settings (nginx, load balancer)
  - Application server timeout settings
  - Database query timeout

### 5. **Infinite Loop or Deadlock**

- **Issue**: Code stuck in infinite loop or database deadlock
- **Check**:
  - Application logs for stuck processes
  - Database locks
  - Transaction deadlocks

---

## Debugging Steps for Backend Developer

### Step 1: Check Application Logs

```bash
# Check for errors, warnings, or stuck processes
tail -f /path/to/application.log
# Look for:
# - Long-running queries
# - Timeout errors
# - Memory errors
# - Database connection errors
```

### Step 2: Check Database Query Performance

```sql
-- Enable query logging
SET log_min_duration_statement = 1000; -- Log queries taking > 1 second

-- Check for slow queries on programmes table
SELECT * FROM pg_stat_statements
WHERE query LIKE '%programmes%'
ORDER BY mean_exec_time DESC;
```

### Step 3: Test Endpoint Directly

```bash
# Test with curl to see exact response time
time curl -X GET "https://api.ihsaanacademia.com/programmes/?page=1&page_size=10" \
  -H "Authorization: Bearer <token>"

# Test with smaller page size
time curl -X GET "https://api.ihsaanacademia.com/programmes/?page=1&page_size=1" \
  -H "Authorization: Bearer <token>"
```

### Step 4: Check Serializer

- Review the Programme serializer
- Check if it's loading unnecessary related data
- Verify prefetch/select_related usage
- Check for serializer methods that make additional queries

### Step 5: Check View/ViewSet

- Review the programmes list view/viewset
- Check filters, ordering, pagination
- Verify no expensive operations in get_queryset()

### Step 6: Database Indexes

```sql
-- Check if programmes table has proper indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'programmes';

-- Check table size
SELECT
    pg_size_pretty(pg_total_relation_size('programmes')) AS total_size,
    COUNT(*) AS row_count
FROM programmes;
```

---

## Quick Fixes to Try

### 1. Reduce Page Size

Try with smaller page size to see if it's a data volume issue:

```
GET /programmes/?page=1&page_size=5
```

### 2. Check Without Pagination

Test if pagination is causing the issue:

```
GET /programmes/
```

### 3. Add Database Indexes

If missing, add indexes on commonly queried fields:

```sql
CREATE INDEX IF NOT EXISTS idx_programmes_created_at ON programmes(created_at);
CREATE INDEX IF NOT EXISTS idx_programmes_is_active ON programmes(is_active);
```

### 4. Optimize Serializer

- Use `select_related()` for foreign keys
- Use `prefetch_related()` for many-to-many or reverse foreign keys
- Exclude unnecessary fields from serializer

### 5. Add Caching

Consider adding caching for programmes list if data doesn't change frequently:

```python
from django.core.cache import cache

def get_programmes():
    cache_key = 'programmes_list'
    programmes = cache.get(cache_key)
    if not programmes:
        programmes = Programme.objects.all()
        cache.set(cache_key, programmes, timeout=300)  # 5 minutes
    return programmes
```

---

## Information to Share with Backend Developer

### Request Details

- **URL**: `https://api.ihsaanacademia.com/programmes/?page=1&page_size=10`
- **Method**: `GET`
- **Headers**: Includes Authorization Bearer token
- **Error**: `504 Gateway Timeout`
- **When**: Happens consistently when loading course creation form

### Environment

- **Frontend**: Next.js application
- **API Base URL**: `https://api.ihsaanacademia.com`
- **Authentication**: JWT Bearer token

### Expected Behavior

- Should return paginated list of programmes
- Response time should be < 2 seconds for 10 items
- Should work consistently

### Current Behavior

- Request times out after ~30-60 seconds (typical gateway timeout)
- No response received
- Blocks course creation flow

---

## Questions for Backend Developer

1. **Is the programmes endpoint working for other users/clients?**

   - Check if this is a user-specific issue or global

2. **What's the typical response time for this endpoint?**

   - Compare with other similar endpoints

3. **Has there been any recent changes to:**

   - Programmes model/serializer?
   - Database schema?
   - Related models (courses, students)?

4. **How many programmes are in the database?**

   - Large dataset might need different pagination strategy

5. **Are there any database migrations pending?**

   - Missing indexes or schema changes

6. **What's the server resource usage?**
   - CPU, memory, database connections

---

## Temporary Workaround (Frontend)

If backend fix takes time, we can:

1. Add retry logic with exponential backoff
2. Show cached programmes if available
3. Allow course creation without programme selection (if business logic allows)
4. Use a different endpoint if available (e.g., `/api/me/programmes/`)

---

## Next Steps

1. **Immediate**: Share this document with backend developer
2. **Short-term**: Implement retry logic in frontend
3. **Long-term**: Optimize backend query and add monitoring
