# DefaultApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteNote**](DefaultApi.md#deleteNote) | **DELETE** /note | Delete Note by Note ID
[**deleteNoteSensor**](DefaultApi.md#deleteNoteSensor) | **DELETE** /note/sensor | Delete Sensor Note
[**deleteNoteTeam**](DefaultApi.md#deleteNoteTeam) | **DELETE** /note/team | Delete Team Note
[**deleteTeam**](DefaultApi.md#deleteTeam) | **DELETE** /team | Delete a Team by Team ID
[**getAllSensor**](DefaultApi.md#getAllSensor) | **GET** /note/all/sensor | Get all Sensor Notes
[**getAllTeam**](DefaultApi.md#getAllTeam) | **GET** /note/all/team | Get all Team Notes
[**getNoteAll**](DefaultApi.md#getNoteAll) | **GET** /note/all | Get all notes
[**getNotesNoteId**](DefaultApi.md#getNotesNoteId) | **GET** /note | Get Note Info by Note ID
[**getTeam**](DefaultApi.md#getTeam) | **GET** /team | Get Team info by Team ID
[**getTeamAll**](DefaultApi.md#getTeamAll) | **GET** /team/all | Get all Teams
[**getTeamNotes**](DefaultApi.md#getTeamNotes) | **GET** /team/notes | Get all Notes linked to the Team by Team ID
[**getTeamSensors**](DefaultApi.md#getTeamSensors) | **GET** /team/sensors | Get all Sensors of a Team by Team ID
[**getTeamUsers**](DefaultApi.md#getTeamUsers) | **GET** /team/users | Get all Users of the Team by Team ID
[**postNoteTeam**](DefaultApi.md#postNoteTeam) | **POST** /note/sensor | Create New Sensor Note
[**postTeam**](DefaultApi.md#postTeam) | **POST** /team | Create new Team
[**postTeamNote**](DefaultApi.md#postTeamNote) | **POST** /note/team | Create New Team Note
[**putNoteSensor**](DefaultApi.md#putNoteSensor) | **PUT** /note/sensor | Update Sensor Note
[**putNoteTeam**](DefaultApi.md#putNoteTeam) | **PUT** /note/team | Update Team Note
[**putTeam**](DefaultApi.md#putTeam) | **PUT** /team | Update a Team

<a name="deleteNote"></a>

# **deleteNote**

> deleteNote(body)

Delete Note by Note ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

<a name="deleteNoteSensor"></a>

# **deleteNoteSensor**

> SensorNote deleteNoteSensor(SensorNote)

Delete Sensor Note

    Delete Sensor Note

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**SensorNote** | [**SensorNote**](../Models/SensorNote.md)| The note you&#39;d like to delete. | [optional]

### Return type

[**SensorNote**](../Models/SensorNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteNoteTeam"></a>

# **deleteNoteTeam**

> TeamNote deleteNoteTeam(TeamNote)

Delete Team Note

    Delete Team Note

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**TeamNote** | [**TeamNote**](../Models/TeamNote.md)| The note you&#39;d like to delete. | [optional]

### Return type

[**TeamNote**](../Models/TeamNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteTeam"></a>

# **deleteTeam**

> Team deleteTeam(body)

Delete a Team by Team ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

[**Team**](../Models/Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getAllSensor"></a>

# **getAllSensor**

> List getAllSensor()

Get all Sensor Notes

### Parameters

This endpoint does not need any parameter.

### Return type

[**List**](../Models/SensorNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getAllTeam"></a>

# **getAllTeam**

> List getAllTeam()

Get all Team Notes

### Parameters

This endpoint does not need any parameter.

### Return type

[**List**](../Models/TeamNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getNoteAll"></a>

# **getNoteAll**

> List getNoteAll()

Get all notes

### Parameters

This endpoint does not need any parameter.

### Return type

[**List**](../Models/Note.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getNotesNoteId"></a>

# **getNotesNoteId**

> Note getNotesNoteId(body)

Get Note Info by Note ID

    Retrieve the information of the note with the matching note ID.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

[**Note**](../Models/Note.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getTeam"></a>

# **getTeam**

> Team getTeam(body)

Get Team info by Team ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

[**Team**](../Models/Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getTeamAll"></a>

# **getTeamAll**

> List getTeamAll()

Get all Teams

### Parameters

This endpoint does not need any parameter.

### Return type

[**List**](../Models/Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getTeamNotes"></a>

# **getTeamNotes**

> List getTeamNotes(body)

Get all Notes linked to the Team by Team ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

[**List**](../Models/TeamNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getTeamSensors"></a>

# **getTeamSensors**

> List getTeamSensors(body)

Get all Sensors of a Team by Team ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

[**List**](../Models/Sensor.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getTeamUsers"></a>

# **getTeamUsers**

> List getTeamUsers(body)

Get all Users of the Team by Team ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**body** | **Integer**|  | [optional]

### Return type

[**List**](../Models/User.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postNoteTeam"></a>

# **postNoteTeam**

> SensorNote postNoteTeam(SensorNote)

Create New Sensor Note

    Create a new Team Note.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**SensorNote** | [**
SensorNote**](../Models/SensorNote.md)| Post a Sensor Note. ID can be ignored here, for it will be changed to a new ID. Upon saving the new note the note will be sent back, it will contain the new ID. | [optional]

### Return type

[**SensorNote**](../Models/SensorNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postTeam"></a>

# **postTeam**

> Team postTeam(Team)

Create new Team

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**Team** | [**
Team**](../Models/Team.md)| The ID doesn&#39;t matter here, it will be replaced by a generated ID. The generated ID can be found in the response. | [optional]

### Return type

[**Team**](../Models/Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postTeamNote"></a>

# **postTeamNote**

> TeamNote postTeamNote(TeamNote)

Create New Team Note

    Create a new Team Note.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**TeamNote** | [**
TeamNote**](../Models/TeamNote.md)| Post a Team Note. ID can be ignored here, for it will be changed to a new ID. Upon saving the new note the note will be sent back, it will contain the new ID. | [optional]

### Return type

[**TeamNote**](../Models/TeamNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putNoteSensor"></a>

# **putNoteSensor**

> SensorNote putNoteSensor(SensorNote)

Update Sensor Note

    Update a Sensor Note.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**SensorNote** | [**SensorNote**](../Models/SensorNote.md)|  | [optional]

### Return type

[**SensorNote**](../Models/SensorNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putNoteTeam"></a>

# **putNoteTeam**

> TeamNote putNoteTeam(TeamNote)

Update Team Note

    Update a Team Note.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**TeamNote** | [**TeamNote**](../Models/TeamNote.md)|  | [optional]

### Return type

[**TeamNote**](../Models/TeamNote.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putTeam"></a>

# **putTeam**

> Team putTeam(Team)

Update a Team

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**Team** | [**Team**](../Models/Team.md)|  | [optional]

### Return type

[**Team**](../Models/Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

