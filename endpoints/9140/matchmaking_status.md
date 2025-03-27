# Endpoint: GET /v0/matchmaking/status

## Description

Retrieves the matchmaking status for a player, including any bans or restrictions. This endpoint is used to determine if
a player is allowed to participate in matchmaking or if they are currently banned.

## Parameters

- `AccountID` (String): The player's account identifier [Required]
    - Example: `f13_ps4_a1b2c3d4e5f6g7h8i9j0`

## Headers

None specifically required

## Request Body

None required

## Response

Returns information about the player's matchmaking status.

```json
{
	"Statuses": [
		{
			"AccountID": "f13_ps4_a1b2c3d4e5f6g7h8i9j0",
			"Error": null,
			"MatchmakingBanSeconds": 0,
			"MatchmakingStatus": "OK"
		}
	]
}
```

### Response Fields:

- `Statuses`: Array containing status information:
    - `AccountID`: Player's account identifier
    - `Error`: Error message if applicable, otherwise null
    - `MatchmakingBanSeconds`: Remaining ban time in seconds (0 if not banned)
    - `MatchmakingStatus`: Current matchmaking status ("OK" if allowed to queue)

## Error Responses

- **404 Not Found**: Returned when the account is not found
  ```json
  {
    "error": "Account not found",
    "status": "ERROR"
  }
  ```

- **400 Bad Request**: Returned when AccountID is missing
  ```json
  {
    "error": "Missing AccountID",
    "status": "ERROR"
  }
  ```

## Game Behavior

- This endpoint is called before attempting to queue for matchmaking, but the response seems to be ignored by the game
- _I am unsure how the game uses this information, as I haven't figured out how infractions work yet_
- Players with "OK" status **should be** allowed to join the matchmaking queue

## Notes

- This endpoint is part of the Profile Authority service (port 9140)
- Ban times are stored in seconds