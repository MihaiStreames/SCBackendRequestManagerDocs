# Endpoint: POST /v1/experience

## Description

Adds experience points to a player's profile, which may result in level ups and the awarding of Customization Points (
CP).
This endpoint handles player progression in the game, allowing them to unlock new content as they gain experience.

## Parameters

- `AccountID` (String): The player's account identifier [Required]
    - Example: `f13_ps4_a1b2c3d4e5f6g7h8i9j0`
- `Exp` (Integer): Amount of experience points to add [Required]
    - Example: `1500`

## Headers

- `Gamer-Tag` (String): The player's gaming platform username [Optional]
    - Example: `Player123456`

## Request Body

None required

## Response

Returns a success message when experience is added successfully.

```json
{
	"message": "Experience added and level updated successfully!",
	"status": "OK"
}
```

## Error Responses

- **404 Not Found**: Returned when the account is not found
  ```json
  {
    "error": "Account not found",
    "status": "ERROR"
  }
  ```

- **400 Bad Request**: Returned when Exp parameter is not an integer
  ```json
  {
    "error": "Exp parameter must be integer",
    "status": "ERROR"
  }
  ```

## Game Behavior

- This endpoint is called after completing matches, challenges, or other activities that award XP
- Experience points contribute to the player's level progression
- When enough XP is accumulated, the player levels up and receives 500 CP
- Additionally, players receive 1 CP for every 10 XP earned
- The required XP for level-up increases with higher levels:
    - Levels 1-199: 1,050 XP required
    - Levels 200-249: 2,090 XP required
    - Levels 250-499: 5,000 XP required
    - Levels 500-699: 6,000 XP required
    - Levels 700+: 9,800 XP required
- **Note:** These aren't the exact values used in the game, as I didn't get them prior to the shutdown

## Notes

- This endpoint is part of the Profile Authority service (port 9140)
- The XP required for level-up is calculated server-side to prevent client manipulation