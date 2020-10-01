# README
- See <https://apex.oracle.com/en/learn/getting-started/>
	- Scroll down to "Run Oracle APEX on-premises"
	- Download the archive
	- See installation instructions at <https://docs.oracle.com/en/database/oracle/application-express/20.1/htmig/overview.html#GUID-DB8E4B2B-1AEB-4B76-BBA3-31C5876C3F14>
		- The page we need after downloading the zip is at <https://docs.oracle.com/en/database/oracle/application-express/20.1/htmig/downloading-installing-Oracle-AE.html#GUID-7E432C6D-CECC-4977-B183-3C654380F7BF>

	- Requires XE Database: <https://www.oracle.com/database/technologies/xe-downloads.html>
	- Run Oracle XE on Linux in a VirtualBox (v6.1)
		- <https://www.brianlinkletter.com/installing-debian-linux-in-a-virtualbox-virtual-machine/>
		- Available downloads: <https://cdimage.debian.org/debian-cd/current/i386/iso-cd/>
		- NetInstall
		    - `wget -e use_proxy=yes -e http_proxy=http://www-proxy-hqdc.us.oracle.com:80 -e https_proxy=http://www-proxy-hqdc.us.oracle.com:80 https://cdimage.debian.org/debian-cd/current/i386/iso-cd/debian-10.5.0-i386-netinst.iso`
		- CD Install
		    - `wget -e use_proxy=yes -e http_proxy=http://www-proxy-hqdc.us.oracle.com:80 -e https_proxy=http://www-proxy-hqdc.us.oracle.com:80 https://cdimage.debian.org/debian-cd/current/i386/iso-dvd/debian-10.5.0-i386-DVD-1.iso`     
		    - `wget -e use_proxy=yes -e http_proxy=http://www-proxy-hqdc.us.oracle.com:80 -e https_proxy=http://www-proxy-hqdc.us.oracle.com:80 https://cdimage.debian.org/debian-cd/current/i386/iso-dvd/debian-10.5.0-i386-DVD-2.iso`     
		    - `wget -e use_proxy=yes -e http_proxy=http://www-proxy-hqdc.us.oracle.com:80 -e https_proxy=http://www-proxy-hqdc.us.oracle.com:80 https://cdimage.debian.org/debian-cd/current/i386/iso-dvd/debian-10.5.0-i386-DVD-3.iso`     

		- ![Create Debian Image](./images/CreateDebianImage.png)
		- ![Create Debian Image](./images/ChooseImage.png)
		
		- For XE (comes as an `rpm`), use Oracle Linux <https://edelivery.oracle.com/osdc/faces/SoftwareDelivery#!>
		- <https://blogs.oracle.com/linux/how-to-download-oracle-linux-iso-images>
		- Download and install Oracle XE on Linux: <https://www.oracle.com/database/technologies/appdev/xe.html>
		- Other site <http://yum.oracle.com/oracle-linux-isos.html>
		    - `wget -e use_proxy=yes -e http_proxy=http://www-proxy-hqdc.us.oracle.com:80 http://yum.oracle.com/ISOS/OracleLinux/OL8/u2/x86_64/OracleLinux-R8-U2-x86_64-dvd.iso`
		    - Doe _NOT_ work
            - Add Guest Addition CD (optical)

	- Docker approach	
		- <https://blogs.oracle.com/oraclemagazine/deliver-oracle-database-18c-express-edition-in-containers>
		- Old - but interesting - article: <https://hub.docker.com/r/oracleinanutshell/oracle-xe-11g>
		- Good resource: <https://github.com/oracle/docker-images>
		
    - Set the proxy if needed:
    ```
    PROXY_HOST=www-proxy.us.oracle.com
    PROXY_PORT=80
    # git config --global http.proxy http://www-proxy-hqdc.us.oracle.com:80
    git config --global http.proxy http://${PROXY_HOST}:${PROXY_PORT}
    echo -n "Proxy: "
    git config --global --get http.proxy
    ```
   - Then clone the repo
    ```
     $ git clone https://github.com/oracle/docker-images.git
     $ cd docker-images/OracleDatabase/SingleInstance/dockerfiles
     $ # ./buildDockerImage.sh -v 19.3.0 -x   # <== No XE in 19.3.0
     $ ./buildDockerImage.sh -v 18.4.0 -x
    ```
    - Be patient, it can take time (~1.5 hour).
    ```
     Build completed in 4566 seconds.
    ```
    - See the image
    ```
    $ docker images
      REPOSITORY                                                             TAG                     IMAGE ID            CREATED             SIZE
      oracle/database                                                        18.4.0-xe               a5960f817a78        5 minutes ago       5.89GB
    ```
    - Run it
    ```
    $ docker run --name myxedb -d -p 51521:1521 -p 55500:5500 -e ORACLE_PWD=mysecurepassword -e ORACLE_CHARACTERSET=AL32UTF8 oracle/database:18.4.0-xe
    73018a29f8670d78c3c52026fb94e900de7e05d5888cb3a51b7363498fd73b8b
    ```
    - See status
    ```
    $ docker ps
    CONTAINER ID        IMAGE                       COMMAND                  CREATED              STATUS                                 PORTS                                              NAMES
    73018a29f867        oracle/database:18.4.0-xe   "/bin/sh -c 'exec $O…"   About a minute ago   Up About a minute (health: starting)   0.0.0.0:51521->1521/tcp, 0.0.0.0:55500->5500/tcp   myxedb
    ```
    - I used `SQLDeveloper` to connect to this instance, as `sys/mysecurepassword`, on port `51521`.
    - Or if `SQL*Plus` is available on your machine, use `sqlplus sys/mysecurepassword@//localhost:51521/XE`.
    - You can create a session in the running docker container and see what's going on:
    ```
    $ docker exec -it --user=oracle myxedb bash
    [oracle@73018a29f867 /]$ . oraenv
    ORACLE_SID = [XE] ? 
    The Oracle base remains unchanged with value /opt/oracle
    [oracle@73018a29f867 /]$ sqlplus sys@XEPDB1 as sysdba
    
    SQL*Plus: Release 18.0.0.0.0 - Production on Fri Sep 18 19:39:53 2020
    Version 18.4.0.0.0
    
    Copyright (c) 1982, 2018, Oracle.  All rights reserved.
    
    Enter password:  (<= use mysecurepassword)
    
    Connected to:
    Oracle Database 18c Express Edition Release 18.0.0.0.0 - Production
    Version 18.4.0.0.0
    
    SQL> show con_name
    
    CON_NAME
    ------------------------------
    XEPDB1
    SQL> 
    ```
    To connect as root (to `yum install vim` for example), just use
    ```
    $ docker exec -it myxedb bash
    ```

## Installing APEX Full Development Environment
As explained [here](https://docs.oracle.com/en/database/oracle/application-express/20.1/htmig/downloading-installing-Oracle-AE.html#GUID-7E432C6D-CECC-4977-B183-3C654380F7BF),
download the latest zip from <https://www.oracle.com/tools/downloads/apex-v191-downloads.html>, like `apex_20.1.zip` and send it to the docker container:
```
$ docker cp apex_20.1.zip myxedb:/home/oracle/apex.zip
```             
In the container, unzip it:
```
$ docker exec -it --user=oracle myxedb bash
[oracle@73018a29f867 /]$ cd
[oracle@73018a29f867 /]$ unzip apex.zip
```
Still in the container, drill down the `apex` directory, and run `SQL*Plus`
```
$ cd apex
$ sqlplus /nolog
SQL> CONNECT SYS as SYSDBA
Enter password: SYS_password 
```
The `sys` password would be here `mysecurepassword`.

Then, as mentioned in [the doc](https://docs.oracle.com/en/database/oracle/application-express/20.1/htmig/downloading-installing-Oracle-AE.html#GUID-7E432C6D-CECC-4977-B183-3C654380F7BF)
(it takes some time):
```
SQL> @apexins.sql SYSAUX SYSAUX TEMP /i/

. . .

catcon.pl: completed successfully


Installation completed. Log files for each container can be found in:

apexins_cdb*.log

You can quickly scan for ORA errors or compilation errors by using a utility
like grep:

grep ORA- *.log
grep PLS- *.log

SQL>
SQL> select username from all_users where username like 'APEX%' order by 1;

USERNAME
--------------------------------------------------------------------------------
APEX_200100
APEX_INSTANCE_ADMIN_USER
APEX_PUBLIC_USER

SQL> 
```
### Docker reminder
To be able to save the state of a docker container, and then reuse it, you need to do the following:
- Let's say you've run the commands above, to build the APEX instance
- From the host, run a 
```
 $ docker ps -a
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS                  PORTS                                              NAMES
20b372c88eb6        oracle/database:18.4.0-xe   "/bin/sh -c 'exec $O…"   23 hours ago        Up 23 hours (healthy)   0.0.0.0:51521->1521/tcp, 0.0.0.0:55500->5500/tcp   myxedb
 $
```
- Then you can save the container state into a new image
```
 $ docker commit 20b372c88eb6 apex:2020-09-20
```
- You can exit the docker session.
```
[oracle@73018a29f867 /]$ exit
```
- To reuse the image, as it was when archived by the `commit`
```
$ docker run --name myxedb -d -p 51521:1521 -p 55500:5500 -e ORACLE_PWD=mysecurepassword -e ORACLE_CHARACTERSET=AL32UT apex:2020-09-20
```
    
### Hosted Approach
- See on <http://apex.oraclecorp.com>, for Oracle internal developments. Request a workspace.
- Resources from Chaitanya Koratamaddi:
    - Hands on labs (start with spreadsheet, then go to existing tables and so on): <https://apex.oracle.com/en/learn/tutorials/>
    - Internal employees sign up for workspace: <https://apex.oraclecorp.com>
    - External /customer facing apps deployment: <http://apexapps.oracle.com> (All applications targeted for apexapps.oracle.com must first be reviewed through the Corporate Security Solution Assurance Process. To begin the onboarding process, you can initiate a request at beo.oraclecorp.com.)
    - Ask anything about APEX in the internal forum : <http://einstein.oracle.com/r/apex>
    - General questions about APEX and apex.oraclecorp.com instance: <https://einstein.oracle.com/apex/f?p=300000:LISTS:8497060567552:::RP,202::>
    - Guided tour video: <https://youtu.be/e-gYK1hjNGo>
    - Other videos (features and how-to): <https://apex.oracle.com/en/learn/videos/>
    - APEX Architecture: <https://apex.oracle.com/en/platform/architecture/>
    - Deployment: <https://apex.oracle.com/en/platform/deployment/>
    - External Community forum: <http://apex.world>
    - Oracle APEX Office Hours (monthly virtual event): <https://apex.oracle.com/officehours>    

#### Use case
Access to `https://api.weather.gov` (doc at <https://www.weather.gov/documentation/services-web-api>)

- Find your location's coordinates (latitude and longitude, in decimal format) 
    - Do it [here](https://olivierld.github.io/web.stuff/gps/LocationFinder.html)
- `GET https://api.weather.gov/points/37.748815,-122.507064`
- This returns
  ```json
    {
        "@context": [
            "https://geojson.org/geojson-ld/geojson-context.jsonld",
            {
                "@version": "1.1",
                "wx": "https://api.weather.gov/ontology#",
                "s": "https://schema.org/",
                "geo": "http://www.opengis.net/ont/geosparql#",
                "unit": "http://codes.wmo.int/common/unit/",
                "@vocab": "https://api.weather.gov/ontology#",
                "geometry": {
                    "@id": "s:GeoCoordinates",
                    "@type": "geo:wktLiteral"
                },
                "city": "s:addressLocality",
                "state": "s:addressRegion",
                "distance": {
                    "@id": "s:Distance",
                    "@type": "s:QuantitativeValue"
                },
                "bearing": {
                    "@type": "s:QuantitativeValue"
                },
                "value": {
                    "@id": "s:value"
                },
                "unitCode": {
                    "@id": "s:unitCode",
                    "@type": "@id"
                },
                "forecastOffice": {
                    "@type": "@id"
                },
                "forecastGridData": {
                    "@type": "@id"
                },
                "publicZone": {
                    "@type": "@id"
                },
                "county": {
                    "@type": "@id"
                }
            }
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
    get to the `properties.forcast`:
- `GET https://api.weather.gov/gridpoints/MTR/85,126/forecast`
- This returns
  ```json
    {
        "@context": [
            "https://geojson.org/geojson-ld/geojson-context.jsonld",
            {
                "@version": "1.1",
                "wx": "https://api.weather.gov/ontology#",
                "geo": "http://www.opengis.net/ont/geosparql#",
                "unit": "http://codes.wmo.int/common/unit/",
                "@vocab": "https://api.weather.gov/ontology#"
            }
        ],
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -122.5090833,
                        37.767808899999999
                    ],
                    [
                        -122.50340989999999,
                        37.746005099999998
                    ],
                    [
                        -122.47585049999999,
                        37.750485300000001
                    ],
                    [
                        -122.48151849999999,
                        37.772289499999999
                    ],
                    [
                        -122.5090833,
                        37.767808899999999
                    ]
                ]
            ]
        },
        "properties": {
            "updated": "2020-09-21T19:56:34+00:00",
            "units": "us",
            "forecastGenerator": "BaselineForecastGenerator",
            "generatedAt": "2020-09-21T20:03:33+00:00",
            "updateTime": "2020-09-21T19:56:34+00:00",
            "validTimes": "2020-09-21T13:00:00+00:00/P7DT12H",
            "elevation": {
                "value": 45.110399999999998,
                "unitCode": "unit:m"
            },
            "periods": [
                {
                    "number": 1,
                    "name": "This Afternoon",
                    "startTime": "2020-09-21T13:00:00-07:00",
                    "endTime": "2020-09-21T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 63,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "9 to 13 mph",
                    "windDirection": "WSW",
                    "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
                    "shortForecast": "Mostly Sunny",
                    "detailedForecast": "Mostly sunny, with a high near 63. West southwest wind 9 to 13 mph."
                },
                {
                    "number": 2,
                    "name": "Tonight",
                    "startTime": "2020-09-21T18:00:00-07:00",
                    "endTime": "2020-09-22T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 57,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "9 to 14 mph",
                    "windDirection": "WSW",
                    "icon": "https://api.weather.gov/icons/land/night/bkn?size=medium",
                    "shortForecast": "Mostly Cloudy",
                    "detailedForecast": "Mostly cloudy, with a low around 57. West southwest wind 9 to 14 mph."
                },
                {
                    "number": 3,
                    "name": "Tuesday",
                    "startTime": "2020-09-22T06:00:00-07:00",
                    "endTime": "2020-09-22T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 62,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "13 mph",
                    "windDirection": "WSW",
                    "icon": "https://api.weather.gov/icons/land/day/bkn?size=medium",
                    "shortForecast": "Partly Sunny",
                    "detailedForecast": "Partly sunny, with a high near 62. West southwest wind around 13 mph."
                },
                {
                    "number": 4,
                    "name": "Tuesday Night",
                    "startTime": "2020-09-22T18:00:00-07:00",
                    "endTime": "2020-09-23T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 56,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "8 to 13 mph",
                    "windDirection": "W",
                    "icon": "https://api.weather.gov/icons/land/night/bkn?size=medium",
                    "shortForecast": "Mostly Cloudy",
                    "detailedForecast": "Mostly cloudy, with a low around 56. West wind 8 to 13 mph."
                },
                {
                    "number": 5,
                    "name": "Wednesday",
                    "startTime": "2020-09-23T06:00:00-07:00",
                    "endTime": "2020-09-23T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 63,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "8 to 12 mph",
                    "windDirection": "W",
                    "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
                    "shortForecast": "Mostly Sunny",
                    "detailedForecast": "Mostly sunny, with a high near 63. West wind 8 to 12 mph."
                },
                {
                    "number": 6,
                    "name": "Wednesday Night",
                    "startTime": "2020-09-23T18:00:00-07:00",
                    "endTime": "2020-09-24T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 58,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "6 to 12 mph",
                    "windDirection": "W",
                    "icon": "https://api.weather.gov/icons/land/night/sct?size=medium",
                    "shortForecast": "Partly Cloudy",
                    "detailedForecast": "Partly cloudy, with a low around 58."
                },
                {
                    "number": 7,
                    "name": "Thursday",
                    "startTime": "2020-09-24T06:00:00-07:00",
                    "endTime": "2020-09-24T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 63,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "6 to 16 mph",
                    "windDirection": "W",
                    "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
                    "shortForecast": "Mostly Sunny",
                    "detailedForecast": "Mostly sunny, with a high near 63."
                },
                {
                    "number": 8,
                    "name": "Thursday Night",
                    "startTime": "2020-09-24T18:00:00-07:00",
                    "endTime": "2020-09-25T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 56,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "9 to 18 mph",
                    "windDirection": "WNW",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
                    "shortForecast": "Mostly Clear",
                    "detailedForecast": "Mostly clear, with a low around 56."
                },
                {
                    "number": 9,
                    "name": "Friday",
                    "startTime": "2020-09-25T06:00:00-07:00",
                    "endTime": "2020-09-25T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 64,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "8 to 16 mph",
                    "windDirection": "NW",
                    "icon": "https://api.weather.gov/icons/land/day/few?size=medium",
                    "shortForecast": "Sunny",
                    "detailedForecast": "Sunny, with a high near 64."
                },
                {
                    "number": 10,
                    "name": "Friday Night",
                    "startTime": "2020-09-25T18:00:00-07:00",
                    "endTime": "2020-09-26T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 56,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "8 to 16 mph",
                    "windDirection": "NW",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
                    "shortForecast": "Mostly Clear",
                    "detailedForecast": "Mostly clear, with a low around 56."
                },
                {
                    "number": 11,
                    "name": "Saturday",
                    "startTime": "2020-09-26T06:00:00-07:00",
                    "endTime": "2020-09-26T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 67,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "9 mph",
                    "windDirection": "NW",
                    "icon": "https://api.weather.gov/icons/land/day/few?size=medium",
                    "shortForecast": "Sunny",
                    "detailedForecast": "Sunny, with a high near 67."
                },
                {
                    "number": 12,
                    "name": "Saturday Night",
                    "startTime": "2020-09-26T18:00:00-07:00",
                    "endTime": "2020-09-27T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 58,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "5 to 9 mph",
                    "windDirection": "WNW",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
                    "shortForecast": "Mostly Clear",
                    "detailedForecast": "Mostly clear, with a low around 58."
                },
                {
                    "number": 13,
                    "name": "Sunday",
                    "startTime": "2020-09-27T06:00:00-07:00",
                    "endTime": "2020-09-27T18:00:00-07:00",
                    "isDaytime": true,
                    "temperature": 84,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "5 to 9 mph",
                    "windDirection": "N",
                    "icon": "https://api.weather.gov/icons/land/day/skc?size=medium",
                    "shortForecast": "Sunny",
                    "detailedForecast": "Sunny, with a high near 84."
                },
                {
                    "number": 14,
                    "name": "Sunday Night",
                    "startTime": "2020-09-27T18:00:00-07:00",
                    "endTime": "2020-09-28T06:00:00-07:00",
                    "isDaytime": false,
                    "temperature": 60,
                    "temperatureUnit": "F",
                    "temperatureTrend": null,
                    "windSpeed": "5 to 8 mph",
                    "windDirection": "WNW",
                    "icon": "https://api.weather.gov/icons/land/night/skc?size=medium",
                    "shortForecast": "Clear",
                    "detailedForecast": "Clear, with a low around 60."
                }
            ]
        }
    }
  ```
- draw a graph with `properties.periods[].temperature`

##### Steps
For inspiration, see <https://blogs.oracle.com/apex/quick-and-easy-twitter-api-with-apex-181>

##### Service at http://api.weather.gov/
- Go to <https://apex.oraclecorp.com/en/> and sign in
- In `App Builder`, create a new application
   - like `REST Weather`
- In `Shared Components` > `Application Definition Attributes`, set your proxy.   
- Create a new Web Source Module **from Scratch**
   - Add `Shared Components` > `Data Sources` > `Web Source Modules` > `Create >`
   - `Method` > `From scratch` > `Next >`
     - Name: `Weather REST API`
     - URL Endpoint: `https://api.weather.gov/points/37.748815,-122.507064` (_requires the proxy to be set!_)
     ![Web Source - 1](./images/01.WebSource.png)
     - Click `Next >`
     ![Web Source - 2](./images/02.WebSource.png)
     - Click `Next >`
     ![Web Source - 3](./images/03.WebSource.png)
     - Click `Discover >`
     ![Web Source - 4](./images/04.WebSource.png)
     - Ooch!
     - In the previous screen, click `Advanced >`
     ![Advanced](./images/advanced.png)
     - Add a Header `Accept: application/json` and/or `Accept: application/geo+json`, make it `Static`, and you're good to go!
     
     
##### Service at `openweathermap`
- Subscribe at <https://openweathermap.org/> to get your AI Key (there are free options)
- Go to <https://apex.oraclecorp.com/en/> and sign in
  - In `App Builder`, create a new application
     - like `REST Weather`
  - In `Shared COmponents` > `Application Definition Attributes`, set your proxy.   
  - Create a new Web Source Module **from Scratch**
     - Add `Shared Components` > `Data Sources` > `Web Source Modules` > `Create >`
     - `Method` > `From scratch` > `Next >`
       - Name: `OpenWeatherMap REST API`
       - URL Endpoint: `http://api.openweathermap.org/data/2.5/onecall?lat=37.75&lon=-122.5&exclude=minutely&appid=17e62fbaa546fb8ed87fc9df51f7d3ec` (_requires the proxy to be set!_)
       ![Web Source - 1](./images/01.WebSource.v2.png)
       - Click `Next >`
       ![Web Source - 2](./images/02.WebSource.v2.png)
       - Click `Next >`
       ![Web Source - 3](./images/03.WebSource.v2.png)
       - Click `Discover >`
       ![Web Source - 4](./images/04.WebSource.v2.png)
       - Click `Create Web Source >`
       ![Web Source - 5](./images/05.WebSource.v2.png)
     - Web Source is now created
       ![Web Source - 6](./images/06.WebSource.v2.png)
       - Click the `Data Profile` tab, and then the `Edit Data Profile` button
       ![Web Source - 7](./images/07.WebSource.v2.png)
       - Here you may show/hide the columns
       ![Web Source - 8](./images/08.WebSource.v2.png)
     - Now, we can create app's pages. Go to the app top tab, and click `Create Page`  
       ![Web Source - 9](./images/09.WebSource.v2.png)
       - I use a Chart
       ![Create Page - 10](./images/10.create.page.png)
       - Area flavor      
       ![Create Page - 11](./images/11.create.page.png)
       - Title, and more options      
       ![Create Page - 12](./images/12.create.page.png)
       - Where to display and access it      
       ![Create Page - 13](./images/13.create.page.png)
       - The source: Use the previously created Web Source      
       ![Create Page - 14](./images/14.create.page.png)
       - Select abscissa and ordinate for the graph, and click `Create`      
       ![Create Page - 15](./images/15.create.page.png)
       - Click the `Save and Run` button on the top right      
       ![Create Page - 16](./images/16.create.page.png)
       - Tadaaa!      
       ![Create Page - 17](./images/17.create.page.png)
---

#### More Resources
- [REST Services Integration](https://blogs.oracle.com/apex/quick-and-easy-twitter-api-with-apex-181) example
- [Beyond the DataBase](https://blogs.oracle.com/oraclemagazine/beyond-the-database)
- [REST Services and PL/SQL](https://blogs.oracle.com/apex/apex-181-early-adopter-2-rest-services-and-plsql)

### Sending parameters to a Web Source
- We want to access resources from `https://api.weather.gov`, as before, but with parameters
- We get the `latitude` and `longitude`, from - let's say - _somewhere_, for now.
- The first call is `GET https://api.weather.gov/points/{latitude},{longitude}`, this will return a `zone`'s coordinates.
    - The `zone`'s coordinates are in the return payload, it will be here `MTR/85,126`
    - It returns a `json` payload, from which we extract `"properties"."forecast"` and `"properties"."forecastHourly"`, it looks like
    ```
    "forecast": "https://api.weather.gov/gridpoints/MTR/85,126/forecast",
    "forecastHourly": "https://api.weather.gov/gridpoints/MTR/85,126/forecast/hourly",
    ```
- Then we do the second call, with then URLs retrieved above.  

#### Let's do it
- Set your proxy at the app level
- Create a Web Source on the first resource, but, instead of 
    ```
    https://api.weather.gov/points/{latitude},{longitude}
    ```
    use
    ```
    https://api.weather.gov/points/:coordinates
    ```
    `:coordinates` will be the _declarative_ parameter.
- When creating the Web Source, when the `:coordinates` is met, you will be prompted for a default value for the parameter
    - Enter `37.75,-122.5`
    
    