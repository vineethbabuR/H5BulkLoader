"use strict"
/**
 * @name: BulkLoader
 * @author: vineeth.babu@aggreko.ae
 * @since: 20220817
 * @version: 1.0.0
 *
 * @description: This tool provides a common interface to load a json string in the M3 Bulk json data structure. The apiname and the transaction can be inferred from the file
 * and validated against the panel the script is loaded to. This wouldnt require an oauth log in token since the user is already in H5 Grid and assuming this will be a bit faster
 */

var BulkLoader = (function () {

    function BulkLoader(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.content = scriptArgs.controller.GetContentElement();
        this.miService = MIService;
        this.userDivi = ScriptUtil.GetUserContext('DIVI');
        this.userCono = ScriptUtil.GetUserContext('CONO');
        this.userName = ScriptUtil.GetUserContext('USID');
        this.scriptName = 'BulkLoader';
        this.baseUrl = "https://mingle-ionapi.eu1.inforcloudsuite.com/"
        this.env = "AGGREKO_TST";
        this.endPoint = '/M3/m3api-rest/v2/execute/';
        this.ionApiService = IonApiService;
        this.payload = "";


    }

    BulkLoader.Init = function Init(scriptArgs) {
        new BulkLoader(scriptArgs).run();
    }

    BulkLoader.prototype.run = function run() {
        console.log(`${this.scriptName} loaded - ${new Date()}`)
        this.createForm();
        this.loadCss();
    }

    BulkLoader.prototype.createForm = function createForm() {
        let _this = this

        let dialogContent = $(`
      <div class="container">
   </br>
   <div class="jsonFileSelection">
      <input type="file" id="jsonFile" style="display:none">
      <button id="btnJsonFile" style="width: 125px">Load JSON</button>
   </div>
   </br>
   <div class="fileProps formcontainer">
      <label class='lbl'>Program</label>
      <input class='ccenter' type='text' id='apiName' disabled style='width:160px'>
   </div>
   <div class="fileProps formcontainer">
      <label class='lbl'>Transaction</label>
      <input class='ccenter' type='text' id='transaction' disabled style='width:160px'>
   </div>
   <div class="fileProps formcontainer">
      <label class='lbl'>Records</label>
      <input class='ccenter' type='text' id='jsonRecords' disabled style='width:160px'>
   </div>
   <div class="loadStatus formcontainer">
</br>
      <label class='lbl'>Success</label>
      <input class='ccenter' type='text' id='successRecords' disabled style='width:160px'>
   </div>
   <div class="loadStatus formcontainer">

      <label class='lbl'>Failed</label>
      <input class='ccenter' type='text' id='failedRecords' disabled style='width:160px'>
      </br>
      </br>
      
   </div class="formcontainer">
        <textarea id="resultArea" placeholder="Row Result" cols="35" rows="10" style="resize: none; font-size: 11px;font-family:'Consolas';font-weight:bold;color:blue;"></textarea>
   <div>
   
</div>
</div>
        `
        );
        let dialogButtons = [
            {
                text: "OK",
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    //model.close(true);
                    _this.executeBulkTransaction();
                }
            },
            {
                text: "Cancel",
                width: 80,
                click: function (event, model) {
                    model.close(true);
                }
            }
        ];

        let dialogOptions = {
            title: "M3 Bulk Loader",
            dialogType: 'General',
            modal: true,
            width: 450,
            minHeight: 520,
            close: function () {
                dialogContent.remove();
            },
            buttons: dialogButtons
        };

        H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);

        $("#btnJsonFile").click(function () {
            $("#jsonFile").trigger('click')
        })

        $("#jsonFile").on('change', function (e) {
            let files = e.target.files;
            let reader = new FileReader();
            reader.onload = function (evt) {
                _this.payload = evt.target.result;
                $("#apiName").val(JSON.parse(evt.target.result).program)
                $("#transaction").val((JSON.parse(evt.target.result).transactions[0].transaction))
                $("#jsonRecords").val((Object.keys(JSON.parse(evt.target.result).transactions).length))
            };
            reader.readAsText(e.target.files[0]);
        })
    }

    BulkLoader.prototype.loadCss = function loadCss() {
        let _this = this;

        $(".container").css({
            "max-width": "450px",
            //"width": "100%",
            "background-color": "rgb(200, 228, 226,0.60)",
            "padding": "5px",
            "border-radius": "5px",
            "box-shadow": "0 5px 10px rgba(110,110,110,0.80)"
        });

        $("#resultArea").css({
            'width': '100%'
        })

        $(".lbl").css({
            "font-family": "'source sans pro',helvetica,arial,sans-serif",
            "box-sizing": "border-box",
            "border": "0",
            "padding": "0",
            "font-weight": "400",
            "line-height": "normal",
            "color": "#000",
            "min-height": "19px",
            "vertical-align": "top",
            "padding-top": "0",
            "padding-botton": "2",
            "overflow": "hidden",
            "font-size": "1.4rem",
            "margin": "0 0 6px 0",
            "flex": "unset",
            "white-space": "nowrap",
            "padding-right": "15px",
            "margin-top": "1px!important",
            "width": "120px",
            "text-align": "left",
            "display": "inline-block"
        });

        $(".ipt").css({
            "box-sizing": "border-box",
            //"text-transform": "lowecase",
            "font-family": "inherit",
            "font-weight": "inherit",
            "margin": "0",
            "transition": "border 300ms ease 0s,box-shadow 300ms ease 0s",
            "border": "1px solid #97979b",
            "border-collapse": "separate",
            "border-radius": "2px",
            "display": "inline-block",
            "max-width": "100%",
            //"background-color": "#d7d7d8",
            "border-color": "#97979b",
            "color": "blue",
            "font-size": "1.4rem",
            "margin-bottom": "0",
            "resize": "none",
            "text-align": "left",
            "min-width": "20px",
            "flex": "unset",
            "padding": "3px 5px",
            "padding-botton": "2",
            "height": "22px",
            //"width": "100px",
            "float": "right",
            "position": "relative",
            "left": "15px",

        });

        $(".ccenter").css({
            "box-sizing": "border-box",
            //"text-transform": "uppercase",
            "font-family": "inherit",
            "font-weight": "inherit",
            "margin": "0",
            "transition": "border 300ms ease 0s,box-shadow 300ms ease 0s",
            "border": "1px solid #97979b",
            "border-collapse": "separate",
            "border-radius": "2px",
            "display": "inline-block",
            "max-width": "100%",
            // "background-color": "#d7d7d8",
            "border-color": "#97979b",
            "color": "blue",
            "font-size": "1.4rem",
            "margin-bottom": "0",
            "resize": "none",
            "text-align": "left",
            "min-width": "20px",
            "flex": "unset",
            "padding": "3px 5px",
            "height": "22px",
            //"width": "150px",
            "position": "relative",
            "left": "78px"
        });

        $("#btnJsonFile").css({
            "background-color":" #111827",
            "border":" 1px solid transparent",
            "border-radius":" .75rem",
            "box-sizing":" border-box",
            "color":" #FFFFFF",
            "cursor":" pointer",
            "flex":" 0 0 auto",
            "font-family":"'Inter var',ui-sans-serif,system-ui,-apple-system,system-ui,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
            "font-size":" 1.125rem",
            "font-weight":"600",
            "line-height":" 1.5rem",
            "padding":" .75rem 1.2rem",
            "text-align":" center",
            "text-decoration":" none #6B7280 solid",
            "text-decoration-thickness":" auto",
            "transition-duration":" .2s",
            "transition-property":" background-color,border-color,color,fill,stroke",
            "transition-timing-function":" cubic-bezier(.4, 0, 0.2, 1)",
            "user-select":" none",
            "-webkit-user-select":" none",
            "touch-action":" manipulation",
            "width":" auto"

        })

             $(".loadStatus").css({
                    'display':'none'
            })

        $("input[disabled]").css({
            'background-color': '#D0D0D0'
        })

            $(".modal-content").draggable();

           
    }

    BulkLoader.prototype.executeBulkTransaction = function executeBulkTransaction() {
        let _this = this;
        let request = {
            //  url : "https://mingle-ionapi.eu1.inforcloudsuite.com/AGGREKO_TST/M3/m3api-rest/v2/execute/",
            url: _this.baseUrl + _this.env + _this.endPoint,
            method: "POST",
            record: _this.payload
        };

        var resultAr = ""

        //console.log(request);

        _this.ionApiService.execute(request).then(function (res) {
            // console.log(res)
            // var responseData = _this.miService.parseResponseV2({}, res);
            console.log('Failed: ', res.data.nrOfFailedTransactions)
            console.log('Success: ', res.data.nrOfSuccessfullTransactions)
            console.log(res.data.results)
            $("#failedRecords").val(res.data.nrOfFailedTransactions)
            $("#successRecords").val(res.data.nrOfSuccessfullTransactions)

                 $(".loadStatus").css({
                    'display':'block'
            })

            var resultSet = res.data.results;

            for (var i = 0; i < resultSet.length; i++) {
                // $("textarea").val($("textarea").val() + i.errorMessage + "\n" )
                let rst = typeof resultSet[i].errorMessage === 'undefined' ? "OK" : resultSet[i].errorMessage
                console.log(`R ${i + 1} ${rst} `)
                $("textarea").val($("textarea").val() + `R${i + 1} ${rst}` + "\n")
            }

        }).catch(function (response) {
            console.log(response.message);
        })

    }
    return BulkLoader;
}());
BulkLoader.Init({'controller': ScriptUtil.getController()})