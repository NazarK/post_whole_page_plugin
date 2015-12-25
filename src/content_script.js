// Copyright (c) 2009 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


//TODO:
// counter should be updated on route delete
// change to hexagon
// open tripsy results in iframe on page


console.log("send to tripsy: content_script.js")

function markAsSent(btn) {
  btn.off("click")
  btn.attr('onclick','')  
  btn.html('sent to tripsy')
  btn.css("background-color","grey")
  btn.css("color","white")
}

var sent_trips = []


//main iframe
$("body").prepend(

'<div onmouseover=document.body.style.overflow="hidden" onmouseout=document.body.style.overflow="auto"'+
' style="box-shadow: 0px 7px 17px 6px rgba(0,0,0,0.75);position:fixed;height:calc(100% - 100px);top:50px;width:calc(100% - 200px);left:100px;z-index:1000;display:none;background:#fff;" id=tripsy_results>'+
'<div style="position:absolute;background-image:url(chrome-extension://'+chrome.runtime.id+'/close_icon.png);cursor:pointer !important;padding:0px;z-index:101;width:14px;height:14px;margin:4px;right:0px;top:0px;" id=tripsy_close></div>'+
'<iframe frameBorder="0" style="width:100%;height:100%;" src=""></iframe>'+
'</div>'

);

$("#tripsy_results #tripsy_close").click(function() {
  $("#tripsy_results").hide()
})

var edit_url;
chrome.runtime.sendMessage({command:'get_results_url'},function(resp) {
  edit_url = resp.edit_url
})

chrome.runtime.sendMessage({command:'get_saved_trips'},function(resp) {
  console.log('got already saved trips')
  console.log(resp)
  sent_trips = resp.saved_trips;
  console.log("adding number of trips indicator")
  //counter
  $("body").prepend(
'<div id="tripsy_hexagon_plane" '+
'style="background-image:url(chrome-extension://'+chrome.runtime.id+'/tripsy_plane_hexagon.png);font-family:Helvetica, Arial, sans-serif;font-family: Helvetica, Arial, sans-serif;position:fixed;right:20px;bottom:20px;color:#09f;z-index:100;font-size:24px;cursor:pointer;width:60px;height:60px;">'+
'  <div id="tripsy_counter" style="font-size:18px;border-radius:20px;padding:0px 5px;position:absolute;background:#49f;right:-6px;top:4px;color:white;">'+
'  </div>'+
'</div>');
  $("#tripsy_counter").html(sent_trips.length)

  $("#tripsy_counter, #tripsy_hexagon_plane").click(function() {
    if($("#tripsy_results iframe").attr("src")=="") {
      $("#tripsy_results iframe").attr("src",edit_url)
    }
    $("#tripsy_results").toggle()
  })
});


if(window.location.href.indexOf("http://www.kayak.com/flights/")==0) {

  setInterval(function() {
  	console.log("send to tripsy: adding  buttons")
    $(".flightresult").each(function() {
      if(!$(this).prev().hasClass("send_to_tripsy")) {

        var id=$(this).attr("id")
        
        var onclick_js = "if(!document.querySelectorAll('#"+id+" .inlinedetailswrapper').length) { document.querySelector('#"+id+" .whenClosed').click() }"
        var style = "padding:0;position:absolute;margin-left:33px;margin-top:75px;color:black;z-index:10;text-align:center;cursor:pointer;min-width:60px;width:110px;background:lightgreen;border-color:green;padding: 0 4px;"


      	$(this).before('<div data-target-id='+id+' onclick="'+onclick_js+'" class="send_to_tripsy ui-button" style="'+style+'">send to tripsy</div>')

        if(sent_trips.indexOf(id)!=-1) {
          markAsSent($(this).prev())        
          return;
        } 

      	$(this).prev().click(function(e) {

          var route_id = $(this).attr("data-target-id")
      		e.preventDefault()
          var btn = $(this)
          btn.off("click")
          btn.attr('onclick','')          
          var trip = $(this).next();

          var interval = setInterval(function() {
            if(trip.find(".inlinedetailswrapper").length) {
                clearInterval(interval)
                sent_trips.push(route_id)
                $("#tripsy_counter").html(sent_trips.length)
                var data = {
                  command: 'save_trip',
                  trip_id: btn.attr('data-target-id'),
                  source_url: location.href,
                  text: trip.find(".tripdetailholder").first().text().replace(/\s\s+/g, ''), 
                  html: trip.find(".tripdetailholder").first().html()
                }
                chrome.runtime.connect().postMessage(data);
                markAsSent(btn)
            }
          },200)

      	})


      }
    })
  },1000)


}
