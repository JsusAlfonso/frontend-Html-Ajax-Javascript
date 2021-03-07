var strIpAddress = "10.2.1.153" //Variable para hacer las conexiones a las apis 
                                //Aqui se coloca la direccion ipv4 para poder usar nuestro sitio en otro dispositivo.

//var paramstr = window.location.search.substr(1).split("=");
//var strToken = paramstr[1]

var strToken = localStorage.getItem("Token");

 /*#######################################################
    # Conseguimos el IMC del cliente                     #
    # Date:20/09/2018                                    #
    ######################################################*/
    function fnImc(){//peso entre la altura al cuadrado
        var wheight = $('#doubWeight').val();
        var height = $('#doubHeight').val();
        var imc = wheight / Math.pow(height,2);
        $("#doubTotal").val(imc);
    }
    
 /*#######################################################
    # Lee el mensaje que enviamos al servidor            #
    # Date:20/09/2018                                    #
    ######################################################*/
    function fnGetMessage() {
        var strName = $('#strName').val();
        var strEmail = $('#strEmail').val();
        var doubWeight = $('#doubWeight').val();
        var doubHeight = $('#doubHeight').val();
        var doubTotal = $('#doubTotal').val();
        if(strName != '' && strEmail != '' && doubWeight != '' && doubHeight != '' && doubTotal != ''){

            $.getJSON('http://'+strIpAddress+':5050/api/fnExample'+'/'+ strName +'/'+ strEmail +'/'+ doubWeight+'/'+doubHeight+'/'+doubTotal)
            .done(function (data) {
                if (data == '') {
                    alert('error');
                }else{
                    $.each(data, function (key, item) {
                        alert(item)
                    })
                }
            });

        }
    }

 /*#######################################################
    # Inserta un usuario a la base de datos              #
    # Date:20/09/2018                                    #
    ######################################################*/
    function fnPutInsertNewUser(){
        var strName = $('#strName').val();
        var strEmail = $('#strEmail').val();
        var doubWeight = $('#doubWeight').val();
        var doubHeight = $('#doubHeight').val();
        var doubTotal = $('#doubTotal').val();
        var strPassword = $('#strPassword').val();
        var strConfirmPassword = $('#strConfirmPassword').val();
        if(strName != '' && strEmail != '' && doubWeight != '' && doubHeight != '' && doubTotal != ''
        && strPassword != '' && strConfirmPassword != '' && strPassword == strConfirmPassword){
            $.ajax({
                type: 'POST',
                url: 'http://' + strIpAddress + ':5050/api/registerUser',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({
                    'Name': strName,
                    'Email':strEmail,
                    'Weight':doubWeight,
                    'Height':doubHeight,
                    'Total':doubTotal,
                    'strPassword':strPassword
                }),
                success: function (result) {
                    if(result.intResp == '200'){
                        $('#mdlMessages').modal('show');
                        $('#mdlMessagesTitle').text('Successfull');
                        $('#mdlMessagesBody').text(result.strMessage);
                        $('#mdlMessagesBtnAction').html('<button type="button" onclick="window.location.replace(\'index.html\')" class="btn btn-default" data-dismiss="modal">Close</button>');
                    }else{
                        $('#mdlMessages').modal('show');
                        $('#mdlMessagesTitle').text('Error');
                        $('#mdlMessagesBody').text(result.strMessage);
                    }
                },
                error: function (result) {
                alert('had a error');
                }
            }); 
        }
    }

 /*#######################################################
    # Busca el usuario en el servidor                    #
    # Date:23/09/2018                                    #
    ######################################################*/
    function fnUserSearch() {
        var strEmail = $('#strEmail').val();
        var strPassword = $('#strPassword').val();

        if(strEmail != '' && strPassword != ''){

            $.getJSON('http://'+strIpAddress+':5050/api/fnUser'+'/'+ strEmail +'/'+ strPassword)
            .done(function (data) {
                if (data == '') {
                    alert('error');
                }else{
                    if(data.intResp == '202'){
                        $('#mdlIndex').modal('show');
                        $('#mdlIndexTitle').text('Error');
                        $('#mdlIndexBody').text(data.strMessage);
                        $('#mdlIndexBtnAction').html('<button type="button" class="btn btn-default" onclick="window.location.replace(\'form.html\')" data-dismiss="modal">Close</button>');
                    
                    }else if(data.intResp == '201'){
                        $('#mdlIndex').modal('show');
                        $('#mdlIndexTitle').text('Error');
                        $('#mdlIndexBody').text(data.strMessage);
                        $('#mdlIndexBtnAction').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
                    
                    }else{
                        //window.location.replace('principal.html?val='+data.strToken); //esta funcion no deja regresar a la pagina anterior
                        localStorage.setItem("Token", data.strToken);
                        window.location.replace('principal.html');
                        //$('#mdlIndex').modal('show');
                        //$('#mdlIndexTitle').text('Success');
                        //$('#mdlIndexBody').text(data.strMessage);
                        //$('#mdlIndexBtnAction').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
                    }
                }
            });

        }
    }

 /*#######################################################
    # De manera dinamica insertamos el regreso           #
    #           a la pagina principal                    #
    # Date:25/09/2018                                    #
    ######################################################*/
    function fnCallHomePage(){
        $('#rtnHomePage').html('<a class="navbar-brand" onclick="window.location.replace(\'index.html\')" title="Return To Home Page"><i class="fa fa-reply-all" aria-hidden="true"></i></a>');
    }

 /*#######################################################
    # Conseguimos la informacion del usuario  para la    #
    #            pagina principal                        #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnGetUserInfo(){
    
        if(strToken != ''){
            $.getJSON('http://'+strIpAddress+':5050/api/fnUserInfo'+'/'+ strToken)
            .done(function (data) {
                if (data == ''|| data == '0') {
                    window.location.replace('index.html');
                }else{
                    $('#navPrincipal').append('<a id="aStrName" class="navbar-brand sm-0"><small>'+data.strName+'</small></a>');
                    $('#mdlPrincipalTitle').html('Edit User Info');
                    $('#mdlPrincipalBody').html('User Name: <input class="form-control" type="text" id="strUserName" name="strUserName" value='+data.strName+' required>' +
                                                'Password: <input class="form-control" type="password" id="strPassword" name="strPassword" placeholder="Change Password" required>');
                    $('#mdlPrincipalBtnAction').html('<button type="button" onclick="fnInfoEdit()" class="btn btn-default">Edit</button>');
                    
                    $('#asideDiv').html('<input type="number" class="form-control form-control-sm" style="width:30vh; float:left;" step="any" id="doubWeight" placeholder="Weight" min="0" name="doubWeight">'
                    +'<input type="button" style="width:30vh;" onclick="fnInsertIMC()" class="btn btn-success form-control form-control-sm" value="Accept">')
                    
                    var arrX = [];
                    var arrY = [];

                    for (i = 0; i < data.arrIMC.length; i++) {
                        arrY.push(data.arrIMC[i].doubTotal);
                        date = new Date(data.arrIMC[i].dteIMC);
                        
                        year = date.getFullYear();
                        month = date.getMonth()+1;
                        dt = date.getDate();

                        if (dt < 10) {
                        dt = '0' + dt;
                        }
                        if (month < 10) {
                        month = '0' + month;
                        }
                        finalDate = year+'-' + month + '-'+dt;
                        arrX.push(finalDate);
                    }

                    fnGetChart(arrX, arrY)
                }
            });
        }

    }

 /*#######################################################
    #   Funcion para salir hasta la pagina de login      #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnExit(){
        localStorage.clear();
        window.location.replace('index.html');
    }

 /*#######################################################
    #   Funcion para editar la informacion del usuario   #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnInfoEdit(){
        var strUserName = $('#strUserName').val();
        var strUserPwd = $('#strPassword').val();
        if(strUserName != '' || strUserName != undefined){
            $.ajax({
                type: 'PUT',
                url: 'http://' + strIpAddress + ':5050/api/fnUpdateUserInfo',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({
                    'strUserName': strUserName,
                    'strUserPwd':strUserPwd,
                    'strToken':strToken
                }),
                success: function (result) {
                    if(result.intResp == '200'){
                        alert(result.strMessage);
                        $('#mdlPrincipal').modal('toggle');
                        $('#aStrName').empty();
                        $('#aStrName').append('<a id="aStrName" class="navbar-brand sm-0"><small>'+strUserName+'</small></a>');
                    }else{
                        alert(result.strMessage);
                        $('#mdlPrincipal').modal('toggle');
                    }
                },
                error: function (result) {
                alert('had a error');
                }
            });
        }else{
            alert('Name Empty');
        }
    }

 /*#######################################################
    #                Eliminar usuario                    #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnDeleteUser(){
        $.ajax({
            type: 'DELETE',
            url: 'http://' + strIpAddress + ':5050/api/fnDeleteUser',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                'strToken':strToken
            }),
            success: function (result) {
                if(result.intResp == '200'){
                    alert(result.strMessage);
                    window.location.replace('index.html');
                }
            },
            error: function (result) {
            alert('had a error');
            }
        });
    }
    
 /*#######################################################
    #                Grafica el chart                    #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnGetChart(arrX, arrY){
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrX,//doublTotal
                datasets: [{
                    label: '# IMC',
                    data: arrY,//Dates
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }
    
 /*#######################################################
    #                Inserta IMC                         #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnInsertIMC(){
        var weight = $('#doubWeight').val();
        $.ajax({
            type: 'PUT',
            url: 'http://' + strIpAddress + ':5050/api/fnUpdateIMC',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                'doubWeight':weight,
                'strToken':strToken
            }),
            success: function (result) {
                if(result.intResp == '200'){
                   //alert(result.strMessage);
                    var arrX = [];
                    var arrY = [];
                    for (i = 0; i < result.arrIMC.length; i++) {
                        arrY.push(result.arrIMC[i].doubTotal);
                        date = new Date(result.arrIMC[i].dteIMC);
                        
                        year = date.getFullYear();
                        month = date.getMonth()+1;
                        dt = date.getDate();

                        if (dt < 10) {
                        dt = '0' + dt;
                        }
                        if (month < 10) {
                        month = '0' + month;
                        }
                        finalDate = year+'-' + month + '-'+dt;
                        arrX.push(finalDate);
                    }
                    fnGetChart(arrX, arrY)
                }else{
                    alert(result.strMessage);
                }
            },
            error: function (result) {
            alert('had a error');
            }
        });
    }

 /*#######################################################
    #         Busca a otros usuarios mediante el correo  #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnGetSearchOthersUsers(){
        var strEmail = $('#strSearch').val();
        if(strEmail != ''){
            $.getJSON('http://'+strIpAddress+':5050/api/fnOtherUserInfo'+'/'+ strEmail)
            .done(function (data) {
                if (data == '') {
                    alert('error');
                }else if(data.intResp == '200'){
                    console.log(data);
                    var arrX = [];
                    var arrY = [];
                    
                    for (i = 0; i < data.arrIMC.length; i++) {
                        arrY.push(data.arrIMC[i].doubTotal);
                        date = new Date(data.arrIMC[i].dteIMC);
                        
                        year = date.getFullYear();
                        month = date.getMonth()+1;
                        dt = date.getDate();

                        if (dt < 10) {
                        dt = '0' + dt;
                        }
                        if (month < 10) {
                        month = '0' + month;
                        }
                        finalDate = year+'-' + month + '-'+dt;
                        arrX.push(finalDate);
                    }

                    fnGetChartOthers(arrX, arrY, data.strName)
                }else{
                    alert(data.strMessage);
                }
            });
        }else{
            alert('Search Empty');
        }
    }

 /*#######################################################
    #         Grafica el chart de la busqueda            #
    # Date:09/10/2018                                    #
    ######################################################*/
    function fnGetChartOthers(arrX, arrY, strName){
        var ctx = document.getElementById("otherChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrX,//doublTotal
                datasets: [{
                    label: '# IMC '+ strName,
                    data: arrY,//Dates
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }