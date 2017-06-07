import { Bayan } from "./Bayan";

namespace request {
    export let keyBd: Array<string>;
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
               // alert(json);
               // alert(json[0].name);
               console.log(json);
               // 自己处理
           },
           error:function(){
               alert('fail');
           }
       });

        /*$.ajax({
            dataType: 'jsonp',
            url: 'localhost:8081/musicList'+'?callback=?',
            processData: false,
            type:'get',
            success: function(data) {
                keyBd = data.keyBd;
                Music = data.Music;
                Instrument = data.Instrument;
                Mobile = [keyBd, Music, Instrument];
                init_one();
                init_two();
                unload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                // alert(XMLHttpRequest.readyState);
                // alert(textStatus);
            }
        });*/

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
        // $.get("https://www.easy-mock.com/mock/592183d59aba4141cf29581d/example/query", {name: Music[j]}, function(data) {
        /*$.get("localhost:8081", {name: Music[j]}, function(data) {
                // Data is the stream of Mid file we recepted.
                // And here should be a function to recept the data stream and play it.
                console.log(data.data.name);
                console.log("Play Music!!!");
                unload();

                // To test without server.
                // setTimeout(function() {
                //     unload();
                // }, 1000);
        });*/

        $.ajax({
           type : "get",
           async: false,
           url: "http://localhost:8081/music"+"?name="+Music[j],
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               // alert(json);
               // alert(json[0].name);
               console.log(json);
               // 自己处理
           },
           error:function(){
               alert('fail');
           }
       });

    }

    //Get the source of instrument.
    export let requestInstrument = function(j: number) {
        loading();
        /*$.get("localhost:8081", {name: Instrument[j]}, function(data) {
            // A function used to change the instrument should be here.
            console.log(data.data.name);
            console.log("Change instrument!!!");
            unload();
        });*/


        $.ajax({
           type : "get",
           async: false,
           url: "http://localhost:8081/"+Instrument[j],
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               // alert(json);
               // alert(json[0].name);
               console.log(json);
               // 自己处理
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