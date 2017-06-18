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
            url: "http://localhost:8081/music?name="+Music[j],
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
           url: "http://localhost:8081/getInstrument?name="+Instrument[j],
           dataType: "jsonp",
           jsonp: "callbackparam",  // 服务端用于接收callback调用的function名的参数
           jsonpCallback:"success_jsonpCallback",  // callback的function名称
           success : function(json) {
               console.log(json[0]);
               unload();
            // json[0]是获取乐器的音源文件字符串
            // 需要添加更改音源文件的函数
           },
           error:function(){
               unload();
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

    // 输入接收的Mid文件字符串，播放音乐文件
    let play = function(fileData: any) {
        let midiparse = new MIDIParser();
        let seq = midiparse.createKeyEvents(fileData);
        MainController.getInstance().loadSequence(seq);
    }
}

export { request };