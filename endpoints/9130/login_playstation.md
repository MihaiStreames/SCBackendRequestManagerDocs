# Endpoint: POST /v0/login/playstation

## Description

Authenticates a PlayStation player and creates or retrieves their account. This is the primary authentication endpoint
for PlayStation users, responsible for creating new accounts for first-time players or retrieving existing accounts for
returning players.

## Parameters

- `PlaystationID` (String): The PlayStation Network ID of the player [Required]
    - Example: `Player123456`
- `PlaystationNumericalID` (String): The numerical identifier associated with the PlayStation account [Required]
    - Example: `987654321`

## Headers

- `User-Agent`: Client identifier [Optional]
    - Example: `F13Game/1.0`

## Request Body

None required

## Response

Returns authentication information including a session token that will be used for subsequent requests.

```json
{
	"PlaystationNumericalID": "987654321",
	"SessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"UserID": "f13_ps4_a1b2c3d4e5f6g7h8i9j0"
}
```

### Response Fields:

- `PlaystationNumericalID`: Echo of the provided numerical ID
- `SessionToken`: Authentication token to be used in subsequent requests
- `UserID`: The internal account identifier generated for this player

## Game Behavior

- When a player launches the game and connects to PSN, this endpoint is called
- New players will have a full account created with default settings
- Returning players will have their account loaded and session token refreshed
- The game stores the session token and account ID locally for future authentication
- After successful authentication, the game will proceed to fetch player data using other endpoints

## Notes

- First-time users are automatically assigned a set of default Jason kills as specified in the `killdata.json` file
- The session token is used to validate the player in subsequent requests via the `/v0/validate` endpoint
- The system automatically creates and updates timestamps for account creation and last login