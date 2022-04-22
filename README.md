# Documentation for CCU-4 API

<a name="documentation-for-api-endpoints"></a>

## Documentation for API Endpoints

All URIs are relative to *http://localhost:8080*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**deleteNote**](reference/gen/Apis/DefaultApi.md#deletenote) | **DELETE** /note | Delete Note by Note ID
*DefaultApi* | [**deleteNoteSensor**](reference/gen/Apis/DefaultApi.md#deletenotesensor) | **
DELETE** /note/sensor | Delete Sensor Note
*DefaultApi* | [**deleteNoteTeam**](reference/gen/Apis/DefaultApi.md#deletenoteteam) | **
DELETE** /note/team | Delete Team Note
*DefaultApi* | [**deleteTeam**](reference/gen/Apis/DefaultApi.md#deleteteam) | **
DELETE** /team | Delete a Team by Team ID
*DefaultApi* | [**getAllSensor**](reference/gen/Apis/DefaultApi.md#getallsensor) | **
GET** /note/all/sensor | Get all Sensor Notes
*DefaultApi* | [**getAllTeam**](reference/gen/Apis/DefaultApi.md#getallteam) | **
GET** /note/all/team | Get all Team Notes
*DefaultApi* | [**getNoteAll**](reference/gen/Apis/DefaultApi.md#getnoteall) | **GET** /note/all | Get all notes
*DefaultApi* | [**getNotesNoteId**](reference/gen/Apis/DefaultApi.md#getnotesnoteid) | **
GET** /note | Get Note Info by Note ID
*DefaultApi* | [**getTeam**](reference/gen/Apis/DefaultApi.md#getteam) | **GET** /team | Get Team info by Team ID
*DefaultApi* | [**getTeamAll**](reference/gen/Apis/DefaultApi.md#getteamall) | **GET** /team/all | Get all Teams
*DefaultApi* | [**getTeamNotes**](reference/gen/Apis/DefaultApi.md#getteamnotes) | **
GET** /team/notes | Get all Notes linked to the Team by Team ID
*DefaultApi* | [**getTeamSensors**](reference/gen/Apis/DefaultApi.md#getteamsensors) | **
GET** /team/sensors | Get all Sensors of a Team by Team ID
*DefaultApi* | [**getTeamUsers**](reference/gen/Apis/DefaultApi.md#getteamusers) | **
GET** /team/users | Get all Users of the Team by Team ID
*DefaultApi* | [**postNoteTeam**](reference/gen/Apis/DefaultApi.md#postnoteteam) | **
POST** /note/sensor | Create New Sensor Note
*DefaultApi* | [**postTeam**](reference/gen/Apis/DefaultApi.md#postteam) | **POST** /team | Create new Team
*DefaultApi* | [**postTeamNote**](reference/gen/Apis/DefaultApi.md#postteamnote) | **
POST** /note/team | Create New Team Note
*DefaultApi* | [**putNoteSensor**](reference/gen/Apis/DefaultApi.md#putnotesensor) | **
PUT** /note/sensor | Update Sensor Note
*DefaultApi* | [**putNoteTeam**](reference/gen/Apis/DefaultApi.md#putnoteteam) | **PUT** /note/team | Update Team Note
*DefaultApi* | [**putTeam**](reference/gen/Apis/DefaultApi.md#putteam) | **PUT** /team | Update a Team

<a name="documentation-for-models"></a>

## Documentation for Models

- [InlineResponse404](reference/gen/Models/InlineResponse404.md)
- [Note](reference/gen/Models/Note.md)
- [Sensor](reference/gen/Models/Sensor.md)
- [SensorHistory](reference/gen/Models/SensorHistory.md)
- [SensorNote](reference/gen/Models/SensorNote.md)
- [Team](reference/gen/Models/Team.md)
- [TeamNote](reference/gen/Models/TeamNote.md)
- [User](reference/gen/Models/User.md)

<a name="documentation-for-authorization"></a>

## Documentation for Authorization

All endpoints do not require authorization.
