import { Bayan } from "./Bayan";
import { MIDIParser } from "./MIDIParser";
import { MainController } from "./mainController";
import { SoundFont } from "./SoundFont";

namespace request {
    export let keyBd: Array<string> = ["keyboardMap3", "keyboardMap4"];
    export let Music: Array<string>;
    export let Instrument: Array<string>;
    export let Mobile: Array<Array<string>>;

    // To get the information of buttons and create them.
    export let requestButton = function(init_one: any, init_two: any) {
       $.ajax({
           type : "get",
           async: false,
           url: "musicList",
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           beforeSend : function() {
               loading();
           },
           success : function(json) {
               Music = json[0].data;
               request.requestMid(2);
           },
           error:function(){
               alert('Fail to get music list');
           },
           complete: function() {
               unload();
           }
       });

       $.ajax({
           type : "get",
           async: false,
           url: "instrument",
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           beforeSend : function() {
               loading();
           },
           success : function(json) {
               Instrument = json[0].data;
               request.requestInstrument(0);
               Mobile = [keyBd, Music, Instrument];
               init_one();
               init_two();
               unload();
           },
           error:function(){
               alert('Fail to get instrument list');
           },
           complete: function() {
               unload();
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
            url: "music?name="+encodeURI(Music[j]),
            dataType: "jsonp",
            jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
            jsonpCallback:"success_jsonpCallback",  // callback的function名称
            success : function(json) {
            //    json[0].data是收到的Mid文件的字符串
                unload();
                let fileData = json[0].data.data.map((v: any)=>{
                    let a = v.toString(16);
                    if (a.length === 1) a = '0' + a;
                    return a;
                });
                fileData = fileData.join("");
                play(fileData);
            },
            error:function(){
                unload();
                alert('Fail to get ' + Music[j]);
            },
           complete: function() {
               unload();
           }
        });

    }

    //Get the source of instrument.
    export let requestInstrument = function(j: number) {
        loading();
        $.ajax({
           type : "get",
           async: false,
           url: "getInstrument?name="+encodeURI(Instrument[j]),
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               unload();
               SoundFont.getInstance().changeInstrument(JSON.stringify(json[0].data));
           },
           error:function(){
               unload();
               alert('Fail to get ' + Instrument[j]);
           },
           complete: function() {
               unload();
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

    // 输入接收的Mid文件字符串，播放音乐文件
    let play = function(fileData: any) {
        let midiparse = new MIDIParser();
        let seq = midiparse.createKeyEvents(fileData);
        MainController.getInstance().loadSequence(seq);
    }
}

export { request };