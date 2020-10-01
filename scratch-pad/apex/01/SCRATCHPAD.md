# First
```
curl -vX GET https://api.weather.gov/points/37.7488,-122.507
Note: Unnecessary use of -X or --request, GET is already inferred.
* Uses proxy env variable https_proxy == 'http://www-proxy.us.oracle.com:80'
*   Trying 148.87.19.20...
* TCP_NODELAY set
* Connected to www-proxy.us.oracle.com (148.87.19.20) port 80 (#0)
* allocate connect buffer!
* Establish HTTP proxy tunnel to api.weather.gov:443
> CONNECT api.weather.gov:443 HTTP/1.1
> Host: api.weather.gov:443
> User-Agent: curl/7.64.1
> Proxy-Connection: Keep-Alive
> 
< HTTP/1.0 200 Connection established
< 
* Proxy replied 200 to CONNECT request
* CONNECT phase completed!
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* CONNECT phase completed!
* CONNECT phase completed!
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES256-GCM-SHA384
* ALPN, server accepted to use h2
* Server certificate:
*  subject: C=US; ST=Maryland; L=College Park; O=National Oceanic and Atmospheric Administration; CN=weather.gov
*  start date: Sep 18 00:00:00 2020 GMT
*  expire date: Oct 18 12:00:00 2021 GMT
*  subjectAltName: host "api.weather.gov" matched cert's "api.weather.gov"
*  issuer: C=US; O=DigiCert Inc; CN=DigiCert SHA2 Secure Server CA
*  SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x7f9a1380d600)
> GET /points/37.7488,-122.507 HTTP/2
> Host: api.weather.gov
> User-Agent: curl/7.64.1
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS == 100)!
< HTTP/2 200 
< server: nginx/1.16.1
< content-type: application/geo+json
< access-control-allow-origin: *
< access-control-allow-headers: Feature-Flags
< x-request-id: e797336e-6345-45b1-9dd5-af60b4ac8c98
< x-correlation-id: 7b1ece5
< x-server-id: vm-bldr-nids-apiapp11.ncep.noaa.gov
< cache-control: public, max-age=86400, s-maxage=120
< expires: Wed, 30 Sep 2020 20:07:51 GMT
< date: Tue, 29 Sep 2020 20:07:51 GMT
< content-length: 3085
< x-edge-request-id: d8bb679
< vary: Accept,Feature-Flags,Accept-Language
< strict-transport-security: max-age=31536000 ; includeSubDomains ; preload
< 
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
. . .
```

When creating the Web Source:
```
Discovery error: Application Express cannot compute a data profile from the response data of type: application/geo+json.
```
Even with headers like
```
Accept: application/json
Accept: application/geo+json
Accept: */*
```

# Second
```
> curl -vX GET https://api.weather.gov/gridpoints/MTR/85,126/forecast/hourly
Note: Unnecessary use of -X or --request, GET is already inferred.
* Uses proxy env variable https_proxy == 'http://www-proxy.us.oracle.com:80'
*   Trying 148.87.19.20...
* TCP_NODELAY set
* Connected to www-proxy.us.oracle.com (148.87.19.20) port 80 (#0)
* allocate connect buffer!
* Establish HTTP proxy tunnel to api.weather.gov:443
> CONNECT api.weather.gov:443 HTTP/1.1
> Host: api.weather.gov:443
> User-Agent: curl/7.64.1
> Proxy-Connection: Keep-Alive
> 
< HTTP/1.0 200 Connection established
< 
* Proxy replied 200 to CONNECT request
* CONNECT phase completed!
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* CONNECT phase completed!
* CONNECT phase completed!
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES256-GCM-SHA384
* ALPN, server accepted to use h2
* Server certificate:
*  subject: C=US; ST=Maryland; L=College Park; O=National Oceanic and Atmospheric Administration; CN=weather.gov
*  start date: Sep 18 00:00:00 2020 GMT
*  expire date: Oct 18 12:00:00 2021 GMT
*  subjectAltName: host "api.weather.gov" matched cert's "api.weather.gov"
*  issuer: C=US; O=DigiCert Inc; CN=DigiCert SHA2 Secure Server CA
*  SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x7fd97780be00)
> GET /gridpoints/MTR/85,126/forecast/hourly HTTP/2
> Host: api.weather.gov
> User-Agent: curl/7.64.1
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS == 100)!
< HTTP/2 200 
< server: nginx/1.16.1
< content-type: application/geo+json
< last-modified: Tue, 29 Sep 2020 16:17:23 GMT
< access-control-allow-origin: *
< access-control-allow-headers: Feature-Flags
< x-request-id: 2d3a9846-56e1-456e-ac72-4e87e4ffdc13
< x-correlation-id: 2256dac7
< x-server-id: vm-bldr-nids-apiapp7.ncep.noaa.gov
< cache-control: public, max-age=900, s-maxage=3600
< expires: Tue, 29 Sep 2020 17:28:07 GMT
< date: Tue, 29 Sep 2020 17:13:07 GMT
< x-edge-request-id: bcc8002
< vary: Accept,Feature-Flags,Accept-Language
< strict-transport-security: max-age=31536000 ; includeSubDomains ; preload
< 
{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "geo": "http://www.opengis.net/ont/geosparql#",
. . .
```
