import { Bayan } from "./Bayan";

namespace request {
    export let keyBd: Array<string> = ["keyboardMap3", "keyboardMap4"];
    export let Music: Array<string>;
    export let Instrument: Array<string>;
    export let Mobile: Array<Array<string>>;

    // To get the information of buttons and create them.
    export let requestButton = function(init_one: any, init_two: any) {
        loading();

       $.ajax({
           type : "get",
           async: false,
           url: "http://localhost:8081/musicList",
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               Music = json[0].data;
           },
           error:function(){
               alert('fail');
           }
       });

       $.ajax({
           type : "get",
           async: false,
           url: "http://localhost:8081/instrument",
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               Instrument = json[0].data;
               Mobile = [keyBd, Music, Instrument];
               init_one();
               init_two();
               unload();
           },
           error:function(){
               alert('fail');
           }
       });
        // The following is used for test without network.

        // keyBd = ["keyboardMap3", "keyboardMap4"];
        // Music = ["M1", "M2", "M3"];
        // Instrument = ["In1", "In2"];
        // Mobile = [keyBd, Music, Instrument];
        // initDropdownMenu();
        // initMoblie();
    }

    // Get Mid file
    export let requestMid = function(j: number) {
        loading();

        $.ajax({
           type : "get",
           async: false,
           url: "http://localhost:8081/music"+"?name="+Music[j],
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               console.log(json[0].data);
               unload();
           },
           error:function(){
               alert('fail');
           }
       });

    }

    //Get the source of instrument.
    export let requestInstrument = function(j: number) {
        loading();

        $.ajax({
           type : "get",
           async: false,
           url: "http://localhost:8081/"+Instrument[j],
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               console.log(json[0]);
               unload();
           },
           error:function(){
               alert('fail');
           }
        });


    }

    let loading = function() {
        let load: any = document.getElementById("loading");
        load.style.visibility = "visible";
    }
    
    let unload = function() {
        let load: any = document.getElementById("loading");
        load.style.visibility = "hidden";

    }
}

export { request };