# Journal Extended API Documentation

## Base URL
`/api/journal-extended`

All endpoints require Authorization header with admin token.

---

## 1. Board Members

### Create Board Member
**Endpoint:** `POST /api/journal-extended/board-member`

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "email": "john.smith@example.com",
  "role": "Senior Editor",
  "status": "active",
  "imageUrl": "https://example.com/images/john.jpg",
  "category": "Editors in Chief",
  "journalId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Board member created successfully",
  "data": {
    "_id": "...",
    "name": "Dr. John Smith",
    "email": "john.smith@example.com",
    "role": "Senior Editor",
    "status": "active",
    "category": "Editors in Chief",
    "journalId": "507f1f77bcf86cd799439011",
    "insertDate": "2024-01-15T10:00:00.000Z"
  }
}
```

### Update Board Member
**Endpoint:** `PUT /api/journal-extended/board-member`

**Request Body:**
```json
{
  "memberId": "507f1f77bcf86cd799439011",
  "name": "Dr. John A. Smith",
  "status": "inactive"
}
```

### Delete Board Member
**Endpoint:** `DELETE /api/journal-extended/board-member/:id`

### Get Board Members List
**Endpoint:** `GET /api/journal-extended/board-member/list`

**Query Parameters:**
- `journalId` (optional)
- `status` (optional: active/inactive)
- `category` (optional: Editors in Chief/Publishers/Reviewers)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Board Member by ID
**Endpoint:** `GET /api/journal-extended/board-member/:id`

---

## 2. Journal Topics

### Create Journal Topic
**Endpoint:** `POST /api/journal-extended/topic`

**Request Body:**
```json
{
  "label": "Computer Science",
  "parentId": null,
  "journalId": "507f1f77bcf86cd799439011",
  "isSpecial": false
}
```

### Update Journal Topic
**Endpoint:** `PUT /api/journal-extended/topic`

**Request Body:**
```json
{
  "topicId": "507f1f77bcf86cd799439011",
  "label": "Computer Science & AI",
  "isSpecial": true
}
```

### Delete Journal Topic
**Endpoint:** `DELETE /api/journal-extended/topic/:id`
> Note: All child topics will also be deleted.

### Get Topics List
**Endpoint:** `GET /api/journal-extended/topic/list`

**Query Parameters:**
- `journalId` (optional)
- `parentId` (optional: null for root topics, or specific ID)
- `isSpecial` (optional: true/false)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Topic by ID
**Endpoint:** `GET /api/journal-extended/topic/:id`

### Get Topic Tree
**Endpoint:** `GET /api/journal-extended/topic/tree/:journalId`

Returns nested tree structure of topics.

---

## 3. Journal Settings (KV)

### Create Journal Setting
**Endpoint:** `POST /api/journal-extended/journal-setting`

**Request Body:**
```json
{
  "settingType": "ArticleType",
  "key": "Research Article",
  "value": {
    "wordLimit": 8000,
    "figuresAllowed": 6
  },
  "isSelected": true,
  "journalId": "507f1f77bcf86cd799439011"
}
```

**settingType values:**
- `ArticleType`
- `AbstractBreakdown`
- `EvaluationForm`

### Update Journal Setting
**Endpoint:** `PUT /api/journal-extended/journal-setting`

**Request Body:**
```json
{
  "settingId": "507f1f77bcf86cd799439011",
  "key": "Research Article - Updated",
  "isSelected": false
}
```

### Delete Journal Setting
**Endpoint:** `DELETE /api/journal-extended/journal-setting/:id`

### Get Settings List
**Endpoint:** `GET /api/journal-extended/journal-setting/list`

**Query Parameters:**
- `journalId` (optional)
- `settingType` (optional)
- `isSelected` (optional: true/false)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Setting by ID
**Endpoint:** `GET /api/journal-extended/journal-setting/:id`

---

## 4. Special Issues

### Create Special Issue
**Endpoint:** `POST /api/journal-extended/special-issue`

**Request Body:**
```json
{
  "title": "AI in Healthcare",
  "expirationDate": "2024-06-30T23:59:59.000Z",
  "guestEditor": "Dr. Jane Doe",
  "description": "Special issue on AI applications in healthcare",
  "status": "active",
  "journalId": "507f1f77bcf86cd799439011"
}
```

### Update Special Issue
**Endpoint:** `PUT /api/journal-extended/special-issue`

**Request Body:**
```json
{
  "issueId": "507f1f77bcf86cd799439011",
  "status": "inactive"
}
```

### Delete Special Issue
**Endpoint:** `DELETE /api/journal-extended/special-issue/:id`

### Get Special Issues List
**Endpoint:** `GET /api/journal-extended/special-issue/list`

**Query Parameters:**
- `journalId` (optional)
- `status` (optional: active/inactive)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Special Issue by ID
**Endpoint:** `GET /api/journal-extended/special-issue/:id`

---

## 5. Guidelines

### Create Guideline
**Endpoint:** `POST /api/journal-extended/guideline`

**Request Body:**
```json
{
  "formatting": "APA 7th Edition",
  "submission": "Submit as PDF and Word document",
  "agreement": "I agree to the terms and conditions...",
  "files": [
    {
      "fileName": "template.docx",
      "fileUrl": "https://example.com/templates/template.docx"
    }
  ],
  "journalId": "507f1f77bcf86cd799439011"
}
```

### Update Guideline
**Endpoint:** `PUT /api/journal-extended/guideline`

**Request Body:**
```json
{
  "guidelineId": "507f1f77bcf86cd799439011",
  "formatting": "APA 8th Edition"
}
```

### Delete Guideline
**Endpoint:** `DELETE /api/journal-extended/guideline/:id`

### Get Guidelines List
**Endpoint:** `GET /api/journal-extended/guideline/list`

**Query Parameters:**
- `journalId` (optional)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Guideline by ID
**Endpoint:** `GET /api/journal-extended/guideline/:id`

---

## 6. Journal Access (Members & Invited Authors)

### Create Access
**Endpoint:** `POST /api/journal-extended/access`

**Request Body:**
```json
{
  "type": "Member",
  "email": "author@example.com",
  "expirationDate": "2025-01-15T23:59:59.000Z",
  "journalId": "507f1f77bcf86cd799439011"
}
```

**type values:**
- `Member` - Has expiration date
- `InvitedAuthor` - No expiration date

### Update Access
**Endpoint:** `PUT /api/journal-extended/access`

**Request Body:**
```json
{
  "accessId": "507f1f77bcf86cd799439011",
  "expirationDate": "2025-06-30T23:59:59.000Z"
}
```

### Delete Access
**Endpoint:** `DELETE /api/journal-extended/access/:id`

### Get Access List
**Endpoint:** `GET /api/journal-extended/access/list`

**Query Parameters:**
- `journalId` (optional)
- `type` (optional: Member/InvitedAuthor)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Access by ID
**Endpoint:** `GET /api/journal-extended/access/:id`

---

## 7. Reminders

### Create Reminder
**Endpoint:** `POST /api/journal-extended/reminder`

**Request Body:**
```json
{
  "recipient": "authors",
  "daysOffset": 7,
  "subject": "Submission Deadline Reminder",
  "message": "Your submission is due in 7 days...",
  "ccOptions": {
    "editor": true,
    "eic": false,
    "admin": true
  },
  "active": true,
  "journalId": "507f1f77bcf86cd799439011"
}
```

**recipient values:**
- `authors`
- `reviewers`
- `editors`

### Update Reminder
**Endpoint:** `PUT /api/journal-extended/reminder`

**Request Body:**
```json
{
  "reminderId": "507f1f77bcf86cd799439011",
  "active": false
}
```

### Delete Reminder
**Endpoint:** `DELETE /api/journal-extended/reminder/:id`

### Get Reminders List
**Endpoint:** `GET /api/journal-extended/reminder/list`

**Query Parameters:**
- `journalId` (optional)
- `active` (optional: true/false)
- `offset` (default: 0)
- `limit` (default: 20)

### Get Reminder by ID
**Endpoint:** `GET /api/journal-extended/reminder/:id`

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "data": {}
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
