# SnapShare: Photo App Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

The estimates use these assumptions:

- Registered users: 10,000,000.
- Daily active users: 10% of registered users.
- Uploads: Each active user uploads 1 photo per day.
- Feed views: Each active user views 50 feed pages per day.
- Average original photo size: 2 MB.
- Each photo has one thumbnail of 50 KB.
- One day is approximated as 100,000 seconds to simplify the calculations, following the course notes.
- Peak traffic is estimated at 5 times average traffic.
- Storage estimates exclude database metadata, backups, replication overhead, and other additional storage.

## 2. Traffic and Storage Estimates

### Daily active users

Daily active users = 10,000,000 × 10%

**Daily active users = 1,000,000**

### Uploads per second

Each active user uploads one photo per day.

Daily uploads = 1,000,000 × 1 = 1,000,000 photos/day

Average uploads per second = 1,000,000 ÷ 100,000

**Average uploads = 10 photos/second**

Estimated peak uploads = 10 × 5

**Peak uploads = 50 photos/second**

### Feed views per second

Each active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50 = 50,000,000 feed views/day

Average feed views per second = 50,000,000 ÷ 100,000

**Average feed views = 500 views/second**

Peak feed views = 500 × 5

**Peak feed views = 2,500 views/second**

### Photo storage per year

Original photo storage per day:

1,000,000 photos × 2 MB = 2,000,000 MB/day = 2 TB/day

Original photo storage per year:

2 TB × 365 = **730 TB/year**

Thumbnail storage per day:

1,000,000 thumbnails × 50 KB = 50,000,000 KB/day = 50 GB/day

Thumbnail storage per year:

50 GB × 365 = **18.25 TB/year**

Total original photo and thumbnail storage:

730 TB + 18.25 TB = **748.25 TB/year**

These estimates use decimal storage units and exclude backups, replicas, metadata, and storage overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is **read-heavy** because it serves approximately 50 million feed views per day but receives 1 million photo uploads per day. Feed views outnumber uploads by 50 to 1.

The architecture should therefore scale the application servers horizontally, cache frequently requested feed data, use a database read replica for read traffic, and serve photo files through a CDN. Photo uploads will write the original image to object storage and save the photo's metadata in the primary database.

## 4. Why Photos Should Not Be Stored Inside the Database

Original photos and thumbnails should be stored in object storage rather than as large binary files inside the database. Object storage is designed for large files and can scale to hundreds of terabytes, while keeping the database focused on structured information such as user IDs, photo IDs, captions, timestamps, and storage locations. The database can return photo metadata and file URLs without transferring large image files through every database query.

## 5. Architecture Diagram

```text
                         SNAPSHARE ARCHITECTURE

 Users / Mobile App / Browser
              |
              v
          DNS / Domain
              |
              +---------------- Static files and cached photos ----------------+
              |                                                                 |
              v                                                                 v
       Load Balancer <-------------------------------------------------------- CDN
              |
       +------+------+ 
       |      |      |
       v      v      v
   App Server 1  App Server 2  App Server 3
       |      |      |
       +------+------+
              |
       +------+------+------------------+
       |             |                  |
       v             v                  v
  Feed Cache    Primary Database   Message Queue
   (Redis)           |                  |
                     |                  v
                     v             Thumbnail Worker
                Read Replica            |
                                        v
                                  Object Storage
                                  (Thumbnails)

 Original photos are uploaded directly through the application flow
 to Object Storage. The CDN serves cached photos and static files.
 The primary database stores photo metadata and storage references.
```

## 6. What Each Component Solves

- **Users / clients:** Allow people to upload photos and browse the feeds of users they follow.
- **DNS:** Translates SnapShare's domain name into the address used to reach its services.
- **CDN:** Serves cached static files and photos from nearby edge locations, reducing latency and load on the origin services.
- **Load balancer:** Distributes API requests across healthy application servers and stops routing traffic to unhealthy servers.
- **Application servers:** Validate uploads, authenticate requests, manage feed logic, and coordinate database, cache, storage, and queue operations.
- **Feed cache (Redis):** Stores frequently requested feed data so the application can respond faster and reduce database load.
- **Primary database:** Stores structured data such as users, follows, photo metadata, captions, timestamps, and object-storage references, and handles writes.
- **Read replica:** Serves suitable read queries to reduce load on the primary database.
- **Object storage:** Stores original photo files and generated thumbnails separately from the database.
- **Message queue:** Holds thumbnail-generation jobs so uploading a photo does not have to wait for thumbnail processing.
- **Thumbnail worker:** Processes queued jobs, creates smaller thumbnail images, and saves them to object storage.

## 7. Photo Upload Flow

1. A user selects a photo and uploads it through the SnapShare application.
2. DNS directs the client to SnapShare's service endpoint, and the load balancer sends the API request to a healthy application server.
3. The application server authenticates the user, validates the upload, and checks the file requirements.
4. The original photo is stored in object storage, which returns or provides the reference needed to locate the file.
5. The application saves the photo metadata and object-storage reference in the primary database.
6. The application places a thumbnail-generation job on the message queue.
7. The application responds to the user that the upload has been accepted or completed, without waiting for thumbnail generation.
8. A thumbnail worker retrieves the job, reads the original photo from object storage, and creates a 50 KB thumbnail.
9. The worker saves the thumbnail in object storage and records or updates its reference if required by the data model.
10. When users view feeds, the application retrieves feed metadata from the cache or a suitable database read source and provides photo URLs; the CDN can serve cached images.

## 8. Trade-offs

### Caching versus freshness

Caching makes feed requests faster and reduces database load, but cached feeds may not immediately show a new photo or a recent follow change. SnapShare should use a suitable time-to-live (TTL) and invalidate or refresh affected cache entries when important data changes.

### Read replicas versus consistency

A read replica reduces pressure on the primary database and helps support read-heavy traffic. However, replication lag can cause a recently uploaded photo or updated metadata to be temporarily missing from replica-backed reads. Important read-after-write requests may need to use the primary database.

### Asynchronous thumbnails versus immediate availability

Using a queue allows the upload request to finish before the thumbnail is generated, improving responsiveness and absorbing traffic bursts. The trade-off is that thumbnails are not available immediately and jobs can fail or be delayed, so workers need retry handling and monitoring.

### Reliability versus cost

Multiple application servers, a read replica, object storage, a CDN, and queue workers improve capacity and resilience but increase infrastructure and operational costs. SnapShare should add capacity based on measured traffic, latency, errors, and storage growth.

## 9. Conclusion

SnapShare has approximately 1 million daily active users, 10 average photo uploads per second, 500 average feed views per second, and an estimated 748.25 TB of annual storage growth for originals and thumbnails. Because feed views greatly outnumber uploads, the design prioritizes caching, read scaling, a CDN, and object storage while using asynchronous workers to generate thumbnails.
