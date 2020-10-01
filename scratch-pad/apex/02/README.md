# Simple REST Service call using APEX

Here I want to invoke a REST service like 
```
GET https://api.weather.gov/points/37.75,-122.50
```
This service returns a `JSON` Object, _that is **not** an array_, nor contains any.
All I need is to get to some attributes of the returned payload.

Here is a sample of the returned payload:
```json
{
    "@context": [
        . . .
    ],
    "id": "https://api.weather.gov/points/37.75,-122.5",
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -122.5,
            37.75
        ]
    },
    "properties": {
        "@id": "https://api.weather.gov/points/37.75,-122.5",
        "@type": "wx:Point",
        "cwa": "MTR",
        "forecastOffice": "https://api.weather.gov/offices/MTR",
        "gridId": "MTR",
        "gridX": 85,
        "gridY": 126,
        "forecast": "https://api.weather.gov/gridpoints/MTR/85,126/forecast",
        "forecastHourly": "https://api.weather.gov/gridpoints/MTR/85,126/forecast/hourly",
        "forecastGridData": "https://api.weather.gov/gridpoints/MTR/85,126",
        "observationStations": "https://api.weather.gov/gridpoints/MTR/85,126/stations",
        "relativeLocation": {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.464979,
                    37.700941
                ]
            },
            "properties": {
                "city": "Daly City",
                "state": "CA",
                "distance": {
                    "value": 6264.6077562384999,
                    "unitCode": "unit:m"
                },
                "bearing": {
                    "value": 330,
                    "unitCode": "unit:degrees_true"
                }
            }
        },
        "forecastZone": "https://api.weather.gov/zones/forecast/CAZ006",
        "county": "https://api.weather.gov/zones/county/CAC075",
        "fireWeatherZone": "https://api.weather.gov/zones/fire/CAZ006",
        "timeZone": "America/Los_Angeles",
        "radarStation": "KMUX"
    }
}
```
What I want is to get to 
- `properties.gridId`
- `properties.gridX` 
- `properties.gridY`
- `properties.forecast`
- `properties.forecastHourly`

The APEX wizards seem not to like the fact that there is no array in the returned payload, we will create 
the `Web Source Module` manually.

- In the APEX UI, I go create a new `Web Source Module`
    ![01](./images/WSM.01.png)
- From Scratch
    ![02](./images/WSM.02.png)
- It's a Simple HTTP Web Source Module, with a parameter `:coordinates`
    ![03](./images/WSM.03.png)
- Click `Next >`
    ![04](./images/WSM.04.png)
- In the `Authentication` screen, click `Create Module Manually`
    ![05](./images/WSM.05.png)
- Click the Module Name in the left column
    ![06](./images/WSM.06.png)
- Click `Edit Data Profile`
    ![07](./images/WSM.07.png)
- We will change the `Row Selector`, and the column definitions
    ![08](./images/WSM.08.png)
- `Row selector` is set to `properties` as in the returned `JSON` Object, and it is a Single Row.
    ![09](./images/WSM.09.png)
- Once the `properties` row selector is set, we can `Rediscover Data Profile`
    ![10](./images/WSM.10.png)
  and it works fine, we see the elements of the `properties` member. But we'll do it manually, as we do not need all those columns,
  we do *not* click the `Extend Data Profile` we just `Close` the dialog.  
- We edit and change the columns definitions, the path (`selector`) is relative to the `Row Selector` 
    ![11](./images/WSM.11.png)
- `Apply Changes`, and now we can create a page
    ![12](./images/WSM.12.png)
- This will be a `Report`
    ![13](./images/WSM.13.png)
- `Classic Report`
    ![14](./images/WSM.14.png)
- Named `Grid Coordinates`
    ![15](./images/WSM.15.png)
- Attached to the `Home`
    ![16](./images/WSM.16.png)
- Based on the just created `Web Source Module`
    ![17](./images/WSM.17.png)
- We can now run it, with the top right button
    ![18](./images/WSM.18.png)
- But there is a `No Data Found` message...
    ![19](./images/WSM.19.png)

---
- Can APEX deal with a single-row returned payload, or does it *have* to be an array?
---

