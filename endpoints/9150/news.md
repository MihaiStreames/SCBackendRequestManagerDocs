# Endpoint: GET /v0/news

## Description

Retrieves game news and announcements to be displayed to the player. This endpoint allows the game to show important
updates, event notifications, and other announcements within the game interface.

## Parameters

- `Page` (Integer): Page number for pagination [Optional]
    - Example: `1`
- `NumPerPage` (Integer): Number of news items per page [Optional]
    - Example: `10`
- `Category` (String): Filter news by category [Optional]
    - Example: `ps4`

## Headers

None specifically required

## Request Body

None required

## Response

Returns a list of news items with their content and metadata.

```json
{
	"Category": "ps4",
	"NewsItems": [
		{
			"Content": "The PS4 Server Test Build is currently live and operational!\n\nIf you encounter cheaters, please report them here:\nhttps://discord.gg/cn5B7SEba8\n",
			"Headline": "PSTB (PS4 Server Test Build) v0.0.1",
			"NewsItemId": "0",
			"UnixTime": 1710864000
		}
	],
	"Page": "1",
	"NumPerPage": "10",
	"TotalCount": 1
}
```

### Response Fields:

- `Category`: The category of news being returned
- `NewsItems`: Array of news items with the following properties:
    - `Content`: The full text content of the news item
    - `Headline`: Title of the news item
    - `NewsItemId`: Unique identifier for the news item
    - `UnixTime`: Timestamp for when the news was posted (Unix epoch time)
- `Page`: Current page number
- `NumPerPage`: Number of items per page
- `TotalCount`: Total number of news items available

## Game Behavior

- News items are displayed on the main menu
- The game caches news items locally (unsure) and refreshes them periodically
- The news is displayed with the headline as a title and the content as the main text

## Notes

- The News Service is hosted on port 9150
- News timestamps are in Unix time (seconds since epoch)
- The response should always include the current server time
- If no news is available, nothing shows up