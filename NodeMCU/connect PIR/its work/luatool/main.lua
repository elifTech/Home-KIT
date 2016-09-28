print(wifi.sta.getip());

gpio.mode(5,gpio.INPUT);

input = 0

tmr.alarm(0, 1000, 1, function()
   input = gpio.read(5);
end)


 -- Start a simple http server
srv=net.createServer(net.TCP)
srv:listen(80,function(conn)
  conn:on("receive",function(conn,payload)
    print(payload)
    conn:send(input)
  end)
  conn:on("sent",function(conn) conn:close() end)
end)