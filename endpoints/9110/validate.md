# Endpoint: POST /v0/validate

## Description

Validates the player's session token to ensure they are properly authenticated. This endpoint serves as a security
measure to prevent unauthorized access to the game's backend services.

## Parameters

None in URL

## Headers

- `Content-Type`: Must be `application/json` [Required]
    - Example: `application/json`

## Request Body

JSON object containing the session token and account ID.

```json
{
	"SessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"AccountId": "f13_ps4_a1b2c3d4e5f6g7h8i9j0"
}
```

### Request Fields:

- `SessionToken`: Token received from the login endpoint
- `AccountId`: Account identifier received from the login endpoint

## Response

Returns a status message indicating successful validation.

```json
{
	"message": "Validation successful",
	"status": "OK"
}
```

## Error Responses

- **403 Forbidden**: Returned when the session token is invalid or expired
  ```json
  {
    "error": "Invalid SessionToken",
    "status": "ERROR"
  }
  ```

- **403 Forbidden**: Returned when the account ID doesn't exist
  ```json
  {
    "error": "Invalid AccountID",
    "status": "ERROR"
  }
  ```

## Game Behavior

- This endpoint is called after login and periodically during gameplay to ensure the session is still valid
- The game uses this validation before allowing access to multiplayer features
- If validation fails, the player is returned to the login screen
- Successful validation allows the game to proceed with accessing other backend services

## Notes

- Session tokens may expire after a certain period of inactivity
- The validate endpoint is part of the Arbiter Service (port 9110) which manages game session validation