//poczatkowa baza danych - domyslne lokacje

var mapCoordinates = 
[
    {
    'name': '111',
    'location': `41°24'12.2"N+2°10'26.5"E`
    }, 
    {
    'name': '222',
    'location': `38°53'22.1"N+77°02'07.0"W`
    },
    {
    'name': '333',
    'location': `52°13'54.6"N+21°00'13.7"E`
    },
];
//haslo
var pass="haslo";
//zmienna globalna na dane
var stored_Coordinates;
if(localStorage["mapCoordinates"]==null)
{
    reset();
    window.location.reload(true);
}

function reset()
{
    localStorage["mapCoordinates"] = JSON.stringify(mapCoordinates);
}

//sprawdzanie czy haslo nie bylo juz wczesniej podane
function checkState()
{
    enableEditing();
    stored_Coordinates=JSON.parse(localStorage["mapCoordinates"]);
    depopulateApp();
    populateApp();
    if(localStorage["logged"]==1)
    {
        
       stored_Coordinates=JSON.parse(localStorage["mapCoordinates"]);
       $("#logMe").css("display","none");   
    }
    else
    {
       // depopulateApp();
        stored_Coordinates=JSON.parse(localStorage["mapCoordinates"]);
        $("#logoutMe").css("display","none");
        $("#loginForm").css("display","none");
        $("#addSection").css("display","none");
      
    }
   
}
//logowanie
document.getElementById("submitButton").addEventListener("click",_=>{
    if($("#password").val()==pass)
    {
        localStorage.setItem("logged", 1);
        $("#dogImg").attr("src","img/goodDog.jpg");
        //localStorage["mapCoordinates"] = JSON.stringify(mapCoordinates);               
        stored_Coordinates=JSON.parse(localStorage["mapCoordinates"]);
        //populateApp();
        $("#appForm").css("display","block")
        $("#logMe").css("display","none");
        $("#logoutMe").css("display","block");
        $("#addSection").css("display","block");
        $("#password").val("0");
        $("#error").text("");
        enableEditing();
        populateApp();
        
    }
    else
    {
       console.log("zle haslo");
       $("#dogImg").attr("src","img/badDog.jpg");
       $("#passwordString").text("Podane hasło jest nieprawidłowe");  
    }
   });

   document.getElementById("logoutButton").addEventListener("click",_=>{
    localStorage.setItem("logged", 0);
    
    $("#logMe").css("display","block");
    $("#logoutMe").css("display","none");
    $("#addSection").css("display","none");
    window.location.reload(true);
    
   
   });
   document.getElementById("resetButton").addEventListener("click",_=>{
    
    reset();
    
    
    window.location.reload(true);
    
    
   
   });

//generowanie tabeli
function populateApp()
{
    if(localStorage["logged"]==1)
    {
        for(iterator in stored_Coordinates)
        {
           // console.log(stored_Coordinates[iterator]["location"]);
            $("#appendTo").append(
            `
             <li class="enterElement col-12">
             <div class="dataRow col-12">
             <input class="locationName col-md-4 col-4 text-center"  value=${stored_Coordinates[iterator]["name"]} > 
             <input class="locationNumber col-md-6 col-7 text-center"  value=${stored_Coordinates[iterator]["location"]}> 
             </div>   
             </li>
            `
            );
             
        }
    }
  
   
}      

//czyszczenie tabeli z danymi
function depopulateApp()
{
    $("#appendTo").html("");
}
function doesItExists(name)
{
    if(name.length>3)
    {
        $("#error").text("Podane Id jest zbyt długie, max 3 znaki");  
        $("#dogImg").attr("src","img/badDog.jpg");
        return true;
    }
    for(iterator in stored_Coordinates)
    {
        if(stored_Coordinates[iterator]["name"]==name)
        {
            $("#error").text("Podane Id lokacji już istnieje w bazie");  
            $("#dogImg").attr("src","img/badDog.jpg");
            return true;
        }
      
    }
    return false;
}
//obsluga zapytania
document.getElementById("mapButton").addEventListener("click",_=>{
   
  
    for(iterator in stored_Coordinates)
    {
        if(stored_Coordinates[iterator]["name"]==$("#option").val())
        {
            window.open(`https://www.google.pl/maps/place/${stored_Coordinates[iterator]["location"]}`, '_blank');
            var flag=true;
        }
      
    }
    if(flag)
    {
        $("#dogImg").attr("src","img/goodDog.jpg");
        $("#error").text("");
        $("#option").val("");
        
    }
    else
    {
        $("#error").text("Podane Id nie istnieje");
        $("#dogImg").attr("src","img/badDog.jpg");
        $("#option").val("");
    }
   });
//dodawanie nowej lokacji
    
    document.getElementById("addButton").addEventListener("click",_=>{
    if(!doesItExists($("#newName").val()))
    
    {
    $("#dogImg").attr("src","img/goodDog.jpg");
    $("#error").text("");
    var newLocation=$("#newLocation").val();
    newLocation=newLocation.replace(/ /g, "+");
    stored_Coordinates.push({name:$("#newName").val(),location:newLocation});
    console.log(stored_Coordinates);   
    localStorage["mapCoordinates"] = JSON.stringify(stored_Coordinates);
    mapCoordinates=stored_Coordinates;  
    depopulateApp();  
    populateApp();
    $("#newName").val("");
    $("#newLocation").val("");
    }
});



depopulateApp();  
populateApp();

//usuwanie elementu
function deleteElement(id)
{
    for(iterator in stored_Coordinates)
    {
        if(stored_Coordinates[iterator]["name"]==id)
        {
            stored_Coordinates.splice(iterator,1);
            mapCoordinates=stored_Coordinates;  
        }
      
    }
}
//edycja elementu
function editElement(id,newid,newLocation)
{
    if(doesItExists(newid) && id!=newid)
    {

        doesItExists(newid);
        
    }
    else
    {
        $("#error").text("");
        $("#dogImg").attr("src","img/goodDog.jpg");
        for(iterator in stored_Coordinates)
        {
            if(stored_Coordinates[iterator]["name"]==id)
            {
                stored_Coordinates[iterator]["name"]=newid;
                stored_Coordinates[iterator]["location"]=newLocation;
                localStorage["mapCoordinates"] = JSON.stringify(stored_Coordinates); 
                mapCoordinates=stored_Coordinates;  
            }
          
        }
    }
   
}
//edycja oraz usuwanie rekordow
function enableEditing() {
    if(localStorage["logged"]==1)
    {
    $(document).on("mouseenter", '.dataRow', function() {
        var id=$(this).find(".locationName").val();
        
       $(this).append(`<button id="deleteButton" class="btn btn-danger">X</button>`);
       $(this).append(`<button id="editButton" class="btn btn-success">Y</button>`);
       $("#deleteButton").click(function(){
        deleteElement(id);
        localStorage["mapCoordinates"] = JSON.stringify(stored_Coordinates); 
        depopulateApp();
        populateApp();
       });
       $(this).find("#editButton").click(function(){
        var newId=$("#editButton").parent().find(".locationName").val()
        var newLoc=$("#editButton").parent().find(".locationNumber").val()
        editElement(id,newId,newLoc);
        localStorage["mapCoordinates"] = JSON.stringify(stored_Coordinates); 
        depopulateApp();
        populateApp();
       });

    });

    $(document).on("mouseleave", '.dataRow', function() {
  
       $(this).find("#deleteButton").detach();
       $(this).find("#editButton").detach();
      
    });
}
};


