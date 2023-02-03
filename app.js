var all_data;
var allAnimals = [];
var allEnvironments = [];
var dinoData = [];
var current_hour;
var current_day;
var current_month;
var current_year;

async function Initialize(){
    await InitializeGrid();
    await GetAllData();
    await GetAllAnimals();
    await GetCurrentDateTime();
    await DetermineHunger();
    await DinoLocation();
}

async function GetAllData() {
    
    const response = await fetch("https://dinoparks.herokuapp.com/nudls/feed");   
    all_data = await response.json();
}

async function InitializeGrid(){

    for (var i=0;i<=15;i++){

        var row_name = "row"+i.toString();

        var row = document.getElementById(row_name);

        let A = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
             
        for (let j = 1; j <= 26; j++) {
    
            let tag = document.createElement("div");
            tag.id = A[j]+i.toString();
            tag.className = "block";
            row.append(tag);
            
        }
    }

}

async function GetAllAnimals(){
    
    let ids = [];
    let ids_filters = [];

    for (var i=0;i<all_data.length;i++){
        var x = all_data[i].dinosaur_id;
        if (x!=null){
            ids.push(x);
        }
        
    }

    ids_filters = ids.filter((x, i, a) => a.indexOf(x) == i);

    for (var j=0;j<ids_filters.length;j++){

        var id = ids_filters[j];

        let digestion_period = 0;
        let gender = "";
        let herbivore = false;
        let name = "";
        let species = "";

        var dino_fed = [];
        var dino_location = [];
        var dino_location_updated = [];
        var dino_added = [];
        var dino_removed = [];

        for(var k=0;k<all_data.length;k++){

            var entry = all_data[k];
    
            if(entry.dinosaur_id==id && entry.kind=="dino_fed"){
                dino_fed.push(entry.time);
            }

            else if(entry.id == id && entry.kind == "dino_added"){
                dino_added.push(entry.time);
                digestion_period = entry.digestion_period_in_hours;
                gender = entry.gender;
                herbivore = entry.herbivore;
                name = entry.name;
                species = entry.species;
            }
            else if(entry.dinosaur_id==id && entry.kind=="dino_location_updated"){
                dino_location_updated.push(entry.time);
                dino_location.push(entry.location);
            }

            else if(entry.id == id && entry.kind=="dino_removed"){
                dino_removed.push(entry.time);
            }
    
            
        }
        var thisDino = {
            "id":id,
            "name":name,
            "species":species,
            "gender":gender,
            "herbivore":herbivore,
            "digestion_period":digestion_period,
            "times_added":dino_added,
            "times_removed":dino_removed,
            "times_fed":dino_fed,
            "locations":dino_location,
            "times_moved":dino_location_updated,
            "is_hungry":[],
            "moved_actions":[],
            "current_location":[]
        }

        dinoData.push(thisDino);
        

    }

    console.log(dinoData);
    
}

async function GetCurrentDateTime(){

    var date = new Date();
    current_hour = parseInt(date.getHours());
    current_day = parseInt(date.getDate());
    current_month = parseInt(date.getMonth()+1);
    current_year = parseInt(date.getFullYear());
}

async function DetermineHunger(){

    var ishungry = false;
    for (var i=0;i<dinoData.length;i++){

        var dino = dinoData[i];
        
        for (var j=0;j<dino.times_fed.length;j++){

            var begin_date = dino.times_fed[j].split("T")[0].split("-");
            var begin_time = dino.times_fed[j].split("T")[1].split(":");

            var begin_hour = parseInt(begin_time[0]);
            var begin_day = parseInt(begin_date[2]);
            var begin_month = parseInt(begin_date[1]);
            var begin_year = parseInt(begin_date[0]);

            var hours_result = AddHours(begin_hour,dino.digestion_period);
            overflow_days = hours_result[0];
            sum_hours = hours_result[1];

            var end_hour = sum_hours;
            var days_result = AddDays(begin_day,begin_month,begin_year,overflow_days); 
            overflow_months = days_result[0];
            sum_days = days_result[1];

            var end_day = sum_days;
            var months_result = AddMonths(begin_month, overflow_months);

            overflow_years = months_result[0];
            sum_months = months_result[1];

            var end_month = sum_months;
            var end_year = AddYears(begin_year, overflow_years);

            if ((begin_day<=current_day)&& (current_day<=end_day)){
                if((begin_month==current_month) && (current_month==end_month)){
                    if((begin_year==current_year) && (end_year==current_year)){
                        ishungry = false;
                    }
                    else{
                        ishungry = true;
                    }
                }
                else{
                    ishungry = true;
                }
                
            }
            else{
                ishungry = true;
            }
            
            dino.is_hungry.push(ishungry);
        }
        dinoData[i] = dino;

    }
    console.log(dinoData);
}

function AddHours(a,b){
    var overflow = 0;
    var sum = a+b;

    if (sum<24){
        overflow = 0;
        sum = sum;
    }
    else if (sum>=24 && sum<48){
        sum = sum - 24;
        overflow = 1;
    }
    else if (sum>=48 && sum<72){
        sum = sum - 48;
        overflow = 2;
    }
    else if (sum>=72){
        sum = sum -72;
        overflow = 3;
    }
    let A = [];
    A.push(overflow);
    A.push(sum);
    return A;
}

function AddDays(day,month,year,b){
    var overflow = 0;
    var sum = day+b;
    var leap_year = CheckLeapYear();

    if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
        if (sum>31){
            sum = sum - 31;
            overflow = 1;
        }
    }
    else if(month==4 || month==6 || month==9 || month==11){
        if (sum>30){
            sum = sum - 30;
            overflow = 1;
        }
    }
    else if(month==2){
        if (leap_year==true){
            if (sum>28){
                sum = sum - 28;
                overflow = 1;
            }
        }
        else{
            if (sum>27){
                sum = sum - 27;
                overflow = 1;
            }
        }
        
    }
    let A = [];
    A.push(overflow);
    A.push(sum);
    
    return A;
}

function AddMonths(month, b){
    var overflow = 0;
    var sum = month+b;

    if(sum>12){
        sum = sum -12;
        overflow = 1;
    }
    let A = [];
    A.push(overflow);
    A.push(sum);
    return A;
}

function CheckLeapYear(x){
    if(x%4==0){
        return true;
    }
    else{
        return false;
    }
}

function AddYears(years, b){
    var sum = years+b;
    console.log("Years sum "+sum);
    return sum;
}

async function DinoLocation(){    
    
    var currentStorage = [];
    currentStorage.push(current_day);
    currentStorage.push(current_month);
    currentStorage.push(current_year);

    for (var i=0;i<dinoData.length;i++){

        var dino = dinoData[i];
        //var current_location = "";
        var storage = [];
        
        storage.push(currentStorage);

        for (var j=0;j<dino.times_moved.length;j++){

            var thisStorage = [];

            var moved_date = dino.times_moved[j].split("T")[0].split("-");

            thisStorage.push(parseInt(moved_date[2]));
            thisStorage.push(parseInt(moved_date[1]));
            thisStorage.push(parseInt(moved_date[0]));

            storage.push(thisStorage);
        }

        var addedstorage = [];
        var notaddedstorage = [];

        for (var k=0;k<storage.length-1;k++){
            var after = CompareTwoDates(storage[k], storage[k+1]);
            if(after==true){
                addedstorage.push(storage[k]);
            }
            else{
                addedstorage.push(storage[k+1]);
            }
        }

        console.log(storage);
        dino.moved_actions = storage;
        
        dinoData[i] = dino;
    }
    console.log(dinoData);
}

function CompareTwoDates(A,B){

    var after = false;
    if (B[2]>A[2]){
        after = true;
    }
    else if(B[2]==A[2]){
        if (B[1]>A[1]){
            after = true;
        }
        else if (B[1]==A[1]){
            if(B[0]>=A[0]){
                after = true;
            }
            else{
                after = false;
            }
        }
        else{
            after = false;
        }
    }
    else{
        after = false;
    }

    return after;

}

