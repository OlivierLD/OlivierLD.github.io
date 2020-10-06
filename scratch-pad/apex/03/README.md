# Third try!

- A REST Server, running on NodeJS, _inside_ the firewall, on `slc11aaf.us.oracle.com`, see `rest.server.js`.
- Try 
    - `GET http://slc11aaf.us.oracle.com:8080/rest/oplist`
    - `GET http://slc11aaf.us.oracle.com:8080/rest/geopos/37.75,-122.50`
    - `GET http://slc11aaf.us.oracle.com:8080/rest/points/37.75,-122.50`
    - `GET http://slc11aaf.us.oracle.com:8080/rest/gridpoints/MTR/85,126/forecast`
    
- It all comes down to:
```
declare
    l_json json_object_t;
    l_clob clob;
    l_properties json_object_t;
    l_to json_object_t;
    l_forcast_url varchar2(128);
begin
    -- Act 1, get Grid Prms (and next URL)
    apex_web_service.g_request_headers.delete;
    apex_web_service.g_request_headers(1).name := 'Accept';
    apex_web_service.g_request_headers(1).value := 'application/json';
    apex_web_service.g_request_headers(2).name := 'User-Agent';
    apex_web_service.g_request_headers(2).value := 'Oracle Application Express';
    
    l_clob := apex_web_service.make_rest_request('http://slc11aaf.us.oracle.com:8080/rest/points/37.75,-122.50','GET'); -- , p_proxy_override=>'www-proxy.us.oracle.com:80');
    -- dbms_output.put_line('Result:' || l_clob);
    htp.p('Raw json:' || to_char(l_clob));

    l_json := json_object_t.parse(l_clob);
    l_properties := l_json.get_object('properties');
    l_forcast_url := l_properties.get_string('forecast');
    
    htp.p('Forecast:' || to_char(l_forcast_url));

    -- Act 2, next URL
    apex_web_service.g_request_headers.delete;
    apex_web_service.g_request_headers(1).name := 'Accept';
    apex_web_service.g_request_headers(1).value := 'application/json';
    apex_web_service.g_request_headers(2).name := 'User-Agent';
    apex_web_service.g_request_headers(2).value := 'Oracle Application Express';
    
    l_clob := apex_web_service.make_rest_request(l_forcast_url,'GET'); -- , p_proxy_override=>'www-proxy.us.oracle.com:80');
    -- dbms_output.put_line('Result:' || l_clob);
    
    htp.p('Raw json:' || to_char(l_clob));
    htp.p('Expected array - to draw a graph - is in properties.period')
    
end;
```
- See/Use it in `SQL Workshop` > `SQL Commands` > `History`
    