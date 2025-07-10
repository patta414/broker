// 
electron = typeof(electron)!='undefined'?electron:false
PROCESS = typeof(PROCESS)!='undefined'?PROCESS:"renderer"
develop_oa = typeof(develop_oa)!='undefined'?develop_oa:false
var wobinich = 'renderer'

// NEUE VERSION 

langKEY = 'DE'
plantKEY = '0067'
colm = []

fun_set_plant=function(plant){
	switch(true){
		case (/0067/).test(plant):
		case (/son/).test(plant):
		case (new RegExp("_so")).test(plant):
		case (/0067/).test(plant):
			langKEY = 'DE';
			plantKEY = '0067'
			break;
		case (/0060/).test(plant):
		case (/bhb/).test(plant):
		case (/0060/).test(plant):
			langKEY = 'DE';
			plantKEY = '0060'
			break;
		case (/0900/).test(plant):
		case (/lav/).test(plant):
		case (/lvl/).test(plant):
			langKEY = 'EN';
			plantKEY = '0900'
			break;
		default:
			window.alert("Change on plant dose not work!\n"+plant)
	}
	funLinks.sap.site=plantKEY;	
}

ber={
    ZweiStellen: function(wert){
        return (wert<10)?"0"+wert:wert
    },
    TageZuMs: function(wert){
        return wert * 1000*60*60*24
    },
    MsZuTage: function(wert){
        return wert / (1000*60*60*24)
    },
    MsZuStunden: function(wert){
        return wert / (1000*60*60)
    },
    StundenZuMs: function(wert){
        return wert * 1000*60*60
    },
    TebZuStkProStunde: function(wert) {
        return 100*Math.pow(wert,-1)
    },
    Kalenderwoche: function(wert) {
        if(!wert){wert=new Date()}
        let anf = new Date(new Date(wert).getFullYear(),0,1);
        if(anf.getDay()==0){
            anf = anf - (7)*1000*60*60*24
        }else if(anf.getDay()>4){
            anf = anf - (anf.getDay()-1)*1000*60*60*24
        }else{
        anf = anf + (anf.getDay()-1)*1000*60*60*24
        };
        return (Math.floor((new Date(wert)-anf)/1000/60/60/24/7))
    },
    Kalendertag: function(wert) {
        if(!wert){wert=new Date()}
        return new Date().getFullYear().toString().substring(2)*1000 + Math.floor((new Date(wert) - new Date(new Date(wert).getFullYear(),0,0))/1000/60/60/24)
    },
    KalendertagRev: function(wert) {
        if(!wert){wert=ber.dat.Kalendertag()}
        return new Date(new Date("1-1-" + wert.toString().substring(0,2)).valueOf() + ber.dat.TageZuMs(wert.toString().substring(2)-1))
    },
    dat: {
    wochentag: ["Sonntag","Montag",'Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
    wochentagKurz: ["So","Mo",'Di','Mi','Do','Fr','Sa'],
    einfach: function(wert){
        let d = new Date()-new Date(wert)
        d = Math.floor(ber.MsZuTage(d))*1;
        switch(true){
            case (d == 0):
                return "heute"
            case (d == 1):
                return "gestern"
            case (d < 7 && d > 0):
                return this.wochentag[new Date(wert).getDay()]
            case (d == -1):
                return "morgen"
            case (d == -2):
                return "übermorgen"
            case (d >= -14 && d < 0):
                return `in ${d*-1} Tagen`
            default:
                x = new Date(wert)
                return ber.ZweiStellen(x.getDate()) + "." +  ber.ZweiStellen((x.getMonth()+1))
        }
    },
    getTag: function(wert){
        let d=wert?new Date(wert):new Date();
        return new Date(d.getFullYear(),d.getMonth(),d.getDate())
    },
    getSchichtdatum: function(wert) {
        let d=wert?new Date(wert):new Date();
        return this.getTag(new Date(d-ber.StundenZuMs(6)))
    },
    getSchichtanfang: {},
    
}
}

funIsDate =function(wert){
	wert=wert||new Date();
	return new Date(wert)
}

funLocalStorage=function(was,wert){
    if (wert){localStorage[was]=wert};
    return localStorage[was]
    }

getFuncName=function() {
     return getFuncName.caller.name
}

funEinAusblenden=function(was){
    //if(!typeof(was)=="object"){
    was = document.getElementById(was)//}
    was.style.display=(was.style.display=="block" || was.style.display == "")?"none":"block"
  
}

funHTMLtagsEntfernen=function(text){
    originalString = text
    return originalString.replace(/(<([^>]+)>)/gi, "");
}

funHTMLtagsEntfernenSchibu=function(text){
    originalString = text
    return originalString.replace(/(<([^>]+)>)|(&#160;)/gi, "");
};

funCleanURL=function(url){
    return url.replaceAll('%20'," ")
		.replaceAll("%3A",":")
		.replaceAll("%27","'")
		.replaceAll("%2a","*")
		.replaceAll("%3d","=")
		.replaceAll("%3b",";")
		.replaceAll("%7e","~")
};

funCleanMatcher=function(matcher){
	return matcher.replaceAll("%","\\%").replaceAll("/","\\/")
}

funLinks = {
        sap:{
			get_name:function(){
				if(langKEY=='DE') return 'SAP Links'
				if(langKEY=='EN') return 'SAP Links'	
			},
			nameDE:'SAP Links',
            site : '0067',
            hrf : "http://moldte-pr3-ap:8000/sap/bc/gui/sap/its/webgui/?sap-client=070&~transaction=",
            l_mi : ["*mm03%20RMMG1-MATNR="],
            l_ap : ["*ca03%20RC27M-MATNR=",";RC27M-WERKS="],
            _aufruf:function(link){       
                window.open(link,"_blank") 
            },
			transactions:{
				"workingplan":{
					get_name:function(){
						if(langKEY=='DE') return 'Arbeitsplan'
						if(langKEY=='EN') return 'Workingplan'
					},
					nameDE: "Arbeitsplan",
					code: "CA03"
				},
				"workingplan_print":{
					get_name:function(){
						if(langKEY=='DE') return 'APL Druck'
						if(langKEY=='EN') return 'WP Print'
					},
					nameDE: "Arbeitsplan",
					code: "YC22"
				},
				"packaging_print":{
					get_name:function(){
						if(langKEY=='DE') return 'VerpV Druck'
						if(langKEY=='EN') return 'Pack Print'
					},
					nameDE: "VerpackungsV",
					code: "YV20"
				},
				"displayMaterial":{
					get_name:function(){
						if(langKEY=='DE') return 'Materialinfo'
						if(langKEY=='EN') return 'Materialinfo'
					},
					nameDE:"Materialinfo",
					code: "MM03"
				},
				"repetitiveManufacturing":{
					get_name:function(){
						if(langKEY=='DE') return 'Serienfertigung'
						if(langKEY=='EN') return 'Repetitive Manufacturing'
					},
					nameDE: "Serienfertigung",
					nameEN: "Repetitive Manufacturing",
					code: "MD04"
				},
				"mmbe":{
					get_name:function(){
						if(langKEY=='DE') return 'Bestand'
						if(langKEY=='EN') return 'Stock'
					},
					nameDE: "Bandsübersicht",
					nameEN: "Stock overview",
					code: "MMBE"
				},
			},
            workingplan : function(materialnumber){
				parts = ["*ca03%20RC27M-MATNR=",";RC27M-WERKS="];
                link = this.hrf + parts[0] + materialnumber + parts[1] + this.site
                this._aufruf(link);
            },
            workingplan_print : function(materialnumber){
				parts = ["*yc22%20S_MATNR-LOW=",";S_WERKS-LOW="];
                link = this.hrf + parts[0] + materialnumber + parts[1] + this.site
                this._aufruf(link);
            },
            packaging_print : function(materialnumber){
				parts = ["yv20 S_MATNR-LOW=",";RC27M-WERKS="];
                link = this.hrf + parts[0] + materialnumber + parts[1] + this.site
                this._aufruf(link);
            },
            mmbe : function(materialnumber){
				parts = ["*mmbe MS_MATNR-LOW=",";MS_WERKS-LOW="];
                link = this.hrf + parts[0] + materialnumber + parts[1] + this.site
                this._aufruf(link);
            },
			_YC254N : function(materialnumber){
				p = ["yc254n%20S_MATNR-LOW=",";P_WERKS=",";S_ERSDA-LOW="];
                link = this.hrf + p[0] + materialnumber + p[1] + this.site + p[2] + funDatum.addDays(-1).toLocaleDateString()
                this._aufruf(link);
            },
            displayMaterial : function(materialnumber){
				parts=["*mm03%20RMMG1-MATNR="]
                link = this.hrf + parts[0] + materialnumber 
                this._aufruf(link);
            },
            repetitiveManufacturing  : function(materialnumber){
				parts=["*md04%20RM61R-MATNR="]
                link = this.hrf + parts[0] + materialnumber 
                this._aufruf(link);
            },
            _RepetitiveManufacturing  : function(){
				this.get_name=function(){
					if(langKEY=='DE') return 'Serienfertigung'
					if(langKEY=='EN') return 'Repetitive Manufacturing'
				}
				this.transaction = "MD04"
				this.fields=["RM61R-MATNR=","RM61R-WERKS="]
                this.link = funLinks.sap.hrf
				this.plant = funLinks.sap.site
				this.call = function(materialnumber,target){
				link = this.link + this.transaction + '%20' + this.fields[0] + materialnumber + ';' + this.fields[1] + plantKEY
				target=target||"_blank"
				window.open(link,target)
				}
			},
			_DisplayMaterial : function(){
				
            }
			
                
              
            },
		cdb:{
			get_name:function(){
				if(langKEY=='DE') return 'CDB Links'
				if(langKEY=='EN') return 'CDB Links'	
			},
			nameDE:'CDB Links',
			hrf:"https://cdb.1000093525.corp.moldtecs.com",
			_aufruf:function(link){       
                window.open(link,"_blank") 
            },
			materiallinks:{
				"Zeichnungen":{
					get_name:function(){
						if(langKEY=='DE') return 'Zeichnungen'
						if(langKEY=='EN') return 'Drawings'
					},
					nameDE: "Zeichnungen",
					code: ""
				}
			},
			"Projektuebersicht":function(project){
				p1="/info/project/";
				link = this.hrf+p1+"EP-"+project
				this._aufruf(link);
				return link
			},
			"Fertigungsmappe":function(project){
				p1="/info/document?__pageid__=hwln09z8&active_tab_id=search-document-cl2zzrtym00003r6b9vgxhiyg&search_on_navigate=true&search_attributes%5B0%5D=zeichnung.cdb_project_id&search_attributes%5B1%5D=zeichnung.cdb_obsolete&search_attributes%5B2%5D=zeichnung.unterlagen_kennung&search_attributes%5B3%5D=zeichnung.titel&search_values%5B0%5D=";
				p2="&search_values%5B1%5D=0&search_values%5B2%5D=MAPD&search_values%5B3%5D=%2ATL0%2A"
				link = this.hrf+p1+"EP-"+project+p2
				this._aufruf(link);
				return link
			},
			"Fertigungsunterlagen":function(project){
				p1="/info/document?__pageid__=hwln09z8&active_tab_id=search-document-cl2zzrtym00003r6b9vgxhiyg&search_on_navigate=true&search_attributes%5B0%5D=zeichnung.cdb_project_id&search_attributes%5B1%5D=zeichnung.cdb_obsolete&search_attributes%5B2%5D=zeichnung.unterlagen_kennung&search_values%5B0%5D="
				p2="&search_values%5B1%5D=0&search_values%5B2%5D=MAPD&search_values%5B3%5D=%2ATL0%2A"
				link = this.hrf+p1+"EP-"+project+p2
				this._aufruf(link);
				return link
			},
			"Zeichnungen":function(material){
				p1="/info/document?__pageid__=ejm20ut2&active_tab_id=search-document-cl3029u9d00003r6bs34s9l9c&search_on_navigate=true&search_attributes%5B0%5D=zeichnung.z_nummer&search_attributes%5B1%5D=zeichnung.titel&search_attributes%5B2%5D=zeichnung.autoren&search_attributes%5B3%5D=zeichnung.cdb_mdate&search_attributes%5B4%5D=zeichnung.unterlagen_kennung&search_attributes%5B5%5D=zeichnung.z_categ1&search_attributes%5B6%5D=zeichnung.vorlagen_kz&search_attributes%5B7%5D=zeichnung.cdb_obsolete&search_attributes%5B8%5D=zeichnung.teilenummer&search_attributes%5B9%5D=.mapped_oberkat&search_values%5B0%5D=&search_values%5B1%5D=&search_values%5B2%5D=&search_values%5B3%5D=&search_values%5B4%5D=&search_values%5B5%5D=5&search_values%5B6%5D=0&search_values%5B7%5D=0&search_values%5B8%5D="
				p2="&search_values%5B9%5D=KONSTRUKTION"
				link = this.hrf+p1+material+p2
				this._aufruf(link);
				return link
			}
			
		},
		dasp_link:{
			get_name:function(){
				if(langKEY=='DE') return 'Datasphere Links'
				if(langKEY=='EN') return 'Datasphere Links'	
			},
			nameDE:'Datasphere Links',
            hrf : "https://mutares.eu10.hcs.cloud.sap/api/v1/dwc/consumption/relational/",
            _aufruf:function(link){       
                window.open(link,"_blank") 
            },
			materiallinks:{
				"materialinfo":{
					get_name:function(){
						if(langKEY=='DE') return 'Materialinfo'
						if(langKEY=='EN') return 'Materialinfo'
					},
					nameDE: "Arbeitsplan",
					
				}
			},
            materialinfo : function(materialnumber){
				space= "MT_APP_CORP_PUBLIC/MT_PUBL_QL_MATERIAL_199/MT_PUBL_QL_MATERIAL_199"
				crit= "?$filter=MATNR%20eq%20%27"
                link = this.hrf + space + crit + materialnumber + "%27 and WERKS eq '"+plantKEY+"'"
                this._aufruf(link);
            }
        },
		pwrbi_link:{
			get_name:function(){
				if(langKEY=='DE') return 'PowerBI Links'
				if(langKEY=='EN') return 'PowerBI Links'	
			},
			nameDE:'PowerBI Links',
            hrf : "https://app.powerbi.com/",
            _aufruf:function(link){       
                window.open(link,"_blank") 
            },
			materiallinks:{
				"materialinfo":{
					get_name:function(){
						if(langKEY=='DE') return 'DaiScr GLPCA'
						if(langKEY=='EN') return 'DaiScr GLPCA'
					}
					
				}
			},
            materialinfo : function(materialnumber){
				space= "groups/612bf98c-9be9-465a-86ec-5785ab9f1022/reports/74986288-1602-46a1-aa81-21037ee41a15/ReportSectiond6ab4b24a834b1f0efb2?filter="
				crit= ["MT_PUBL_QL_MATERIAL_x0020_0067/MATNR eq '","'"]
                link = this.hrf + space + crit[0] + materialnumber + crit[1]
                this._aufruf(link);
            }
        },
		_openNewWindow:function(link){
			window.open(link,"_blank") 	

			
		}
    }

funDatum={
		excelDateToJSDate(excelDate) {
		  // Excel-Datum startet am 1. Januar 1900, JavaScript am 1. Januar 1970
		  const msInDay = 86400000; // Millisekunden in einem Tag
		  const excelStartDate = new Date(1900, 0, 1); // 1. Januar 1900
		  
		  // Korrigiere den Excel-Fehler (Excel zählt das Jahr 1900 fälschlicherweise als Schaltjahr)
		  const adjustedExcelDate = excelDate - 2; // Korrektur für den Fehler des 29. Februar 1900
		  
		  // Umwandlung der Excel-Datumszahl in Millisekunden und Rückgabe als JavaScript Date-Objekt
		  const jsDate = new Date(excelStartDate.getTime() + adjustedExcelDate * msInDay);
		  
		  return jsDate;
		},
        value:new Date(),
        formatDatepicker: function(d){
            d=d||new Date();
            return d.getFullYear()+"-"+funDatum.fuehrNull(d.getMonth()+1)+'-'+funDatum.fuehrNull(d.getDate())
        },
		formatFMDatepicker: function(d){
            d=funIsDate(d);
            return funDatum.fuehrNull(d.getDate())+"."+funDatum.fuehrNull(d.getMonth()+1)+"."+d.getFullYear()
        },
        formatDateTimePicker: function(d,h,m,s){
            d=d||new Date();
            fn=funDatum.fuehrNull;
            h=h>=0?h:d.getHours();
            m=m>=0?m:d.getMinutes();
            s=s>=0?s:d.getSeconds();
            return fn(d.getDate())+"."+fn(d.getMonth()+1)+'.'+d.getFullYear()+" "+fn(h)+':'+fn(m)+':'+fn(s)
        },
		formatSQLDateTime: function(d,h,m,s){
            d=d||new Date();
            fn=funDatum.fuehrNull;
            h=h>=0?h:d.getHours();
            m=m>=0?m:d.getMinutes();
            s=s>=0?s:d.getSeconds();
            return d.getFullYear()+"-"+fn(d.getMonth()+1)+'-'+fn(d.getDate())+" "+fn(h)+':'+fn(m)+':'+fn(s)
        },
        fuehrNull: function(v){
            return v<10?'0'+v:v
        },
        getSchicht: function(d){
            d=d||new Date()
            d=new Date(d)
            if(d.getHours()<6) return 3
            return Math.floor((d.getHours()-6)/8)+1
        },
		getShift: function(d){
            d=d||new Date()
            d=new Date(d)
            if(d.getHours()<6) return 3
            return Math.floor((d.getHours()-6)/8)+1
        },
		getShiftFromLetter: function(FSN){
            return ["","F","S","N"].indexOf(FSN.toUpperCase())
        },
		getShiftLetter: function(numb){
			return ["","F","S","N"][numb]
		},
        addDays: function(days,d){
            d=d||new Date()
            d=new Date(d)*1
            days=days||0
            return new Date(d+(60*60*1000*24*days))  
        },
        addHours: function(hours,d){
            d=d||new Date();
            d=new Date(d)*1;
            hours=hours||0;
            return new Date(d+(60*60*1000*hours))  
        },
        getShiftStart: function(versH,d,s){
            d=d||new Date();
            d=new Date(d);
            s=s||this.getSchicht(d);
            v=versH||0
            a=this.addHours;
            return new Date(a(s*8,a(-2+v,d.toDateString())))
        },
        getShiftEnd: function(versH,d,s){
            d=d||new Date();
            d=new Date(d);
            s=s||this.getSchicht(d);
            v=versH||0
            a=this.addHours;
            return new Date(a(s*8,a(-2+v+8,d.toDateString())))
        },
		getShiftStartTime(shift,shiftdate,or_timestamp){
			timestamp = or_timestamp ?? new Date();
			let sd = shiftdate ?? this.getShiftDate(timestamp);
			let s = (shift ?? this.getShift(timestamp)) - 1;
			return this.addHours(6 + s * 8, new Date(sd));
		},
		formatDatefromFMPicker: function(string){
			d=string.slice(0,2)
			m=string.slice(3,5)-1
			y=string.slice(6,10)
			return new Date(y,m,d)
		},
		getMonthName(Number){
			Number=typeof(Number)=="undefined"?new Date().getMonth():Number;
			m=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
			return m[Number]
		},
		getMonthName_short(Number){
			Number=typeof(Number)=="undefined"?new Date().getMonth():Number;
			m=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
			return m[Number]
		},
		getSimpelDate: function(date){
			date = funIsDate(date);
			let diff = new Date()-new Date(date)
			d = Math.floor(ber.MsZuTage(diff))*1;
			switch(true){
				case (d == 0):
					return "heute"
				case (d == 1):
					return "gestern"
				case (d < 7 && d > 0):
					return this.getWeekdayname(new Date(date))
				case (d == -1):
					return "morgen"
				case (d == -2):
					return "übermorgen"
				case (d >= -14 && d < 0):
					return `in ${d*-1} Tagen`
				default:
					x = new Date(date)
					return this.getGermanDate(x)
			}
		},
		getWeekdayname(date,lengt){
			d=date||new Date();
			lengt=lengt||99
			d=new Date(d).getDay()
			s=["Sonntag","Montag",'Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
			return s[d].slice(0,lengt)
		},
		getGermanDate(date){
			d=funIsDate(date);
			return ""+this.fuehrNull(d.getDate())+"."+this.fuehrNull(d.getMonth()+1)+"."+d.getFullYear()
		},
		germanToDate(str){
			str.split(".")
			return new Date(d[2],d[1]-1,d[0])
		},
		germanTimestampToDate(str){
			str = str.replaceAll(","," ")
			str = str.replaceAll("  "," ").replaceAll("  "," ")
			let strD = str.split(" ")[0]
			let d = strD.split(".")
			d = new Date(d[2],d[1]-1,d[0])
			let strT = str.split(" ")[1]
            strT = strT.split(":")
            let h = 0+(strT[0]*1)+(strT[1]/60)+(strT[2]/3600)
			d=funDatum.addHours(h,d)
			return d
		},
		getMillisecondsFromTime(HH_MM_SS){
			let strT = HH_MM_SS
            strT = strT.split(":")
            let h = 0+(strT[0]*1)+(strT[1]/60)+((strT[2]/3600)||0)
			return h*3600*1000
		},
		shiftAndTimeToStamp:function(shift_date, shift_number, HH_MM_SS) {
			let d = new Date(`${shift_date}T00:00:00`);
			
			// Korrektur der Sommerzeit
			let timezoneOffsetBefore = d.getTimezoneOffset(); // Offset vor der Berechnung
			let h = this.getMillisecondsFromTime(HH_MM_SS) / 3600 / 1000;
			let diffH = 0;

			if (shift_number == 3 && h < 22) diffH = 24;

			let newDate = this.addHours(diffH + h, d);
			let timezoneOffsetAfter = newDate.getTimezoneOffset(); // Offset nach der Berechnung

			// Falls sich der Offset geändert hat (Sommerzeitumstellung), korrigieren wir die Stunden
			let offsetDifference = (timezoneOffsetAfter - timezoneOffsetBefore) / 60;
			newDate = this.addHours(offsetDifference, newDate);

			return newDate;
		},
		getDayStart:function(date){
			d=date||new Date()
			d=new Date(d)
			return new Date(funDatum.formatDatepicker(d))
		},
		getShiftDate(timestamp){
			d=timestamp||new Date()
			d=new Date(d)
			return this.formatDatepicker(this.addHours(-6,d))
		},
		getShiftDate(timestamp){
			let d;
			if (timestamp instanceof Date) {
				d = timestamp;
			} else if (typeof timestamp === "number") {
				d = new Date(timestamp);
			} else if (typeof timestamp === "string" && timestamp.length > 10) {
				d = new Date(timestamp);
			} else if (typeof timestamp === "string") {
				d = new Date(`${timestamp}T06:00:00`);
			} else {
				d = new Date(); // Falls kein gültiger Timestamp übergeben wird
			}

			return this.formatDatepicker(this.addHours(-6, d));
		},
		getDuration:function(difference){
			fn = this.fuehrNull
			let weeks = difference/1000/60/60/24/7
			let days = ((weeks%1)*7);
			let hours = ((days%1)*24);
			let minutes = ((hours%1)*60);
			let sec= ((minutes%1)*60);
			if(weeks >= 3) {
				return "> "+weeks.toFixed(0)+"Wo"
			}else if(weeks > 1){
				days = ((weeks%1)*7).toFixed(0);
				return ""+weeks.toFixed(0)+"Wo "+days+"d"
			}else if(days>1){
				hours = hours.toFixed(0);
				return ""+days+"d "+hours+"h"
			}else if(hours > 1){
				minutes = ((hours%1)*60).toFixed(0)
				hours = hours.toFixed()
				return ""+fn(hours)+":"+fn(minutes)+" std"
			}else if(minutes < 1){
				let milli = ((sec%1)*60).toFixed(0)
				sec = sec.toFixed(0)
				if(sec > 10) return ""+fn(sec)+" sec"
				return ""+fn(sec)+"."+milli+" sec"
			}else{
				sec = ((minutes%1)*60).toFixed()
				minutes = minutes.toFixed()
				return ""+fn(minutes)+":"+fn(sec)+" min"
			}
		},
		
};

funArraymove=function(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
};	

funAddHtmlE=function(targetQueryOrObj,typ,innerhtml,id,param_val,event_func,insertFirst){
	try{
        t=(typeof(targetQueryOrObj)=='string')?document.querySelector(targetQueryOrObj):targetQueryOrObj
        let r = document.createElement(typ)
        if(innerhtml) r.innerHTML=innerhtml
        if(id) r.id=id
        for(p in param_val){r.setAttribute(p,param_val[p])}
        for(e in event_func){r.addEventListener(e,eval(event_func[e]))}
        if(insertFirst){t.insertBefore(r, t.firstChild);}else{t.appendChild(r)}
        return r
	}catch(err){console.log(err)}
    };

funChangeDisplay=function(str_qry,display){
    let e=(typeof(str_qry)=='string')?document.querySelector(str_qry):str_qry;
	if (e == null) return
    let o = e.style.display;
    //let v='none';
    switch(true){
        case (display!=undefined): v=display
            break;
        case (e.style.display_old!=undefined && e.style.display_old!=o): v=e.style.display_old
            break;
        case (e.style.display=='none'): v=""
            break;
        default: v='none'
    };
    e.style.display=v
    if(v!=o) e.style.display_old = o;
};

funChangeDisplayObject=function(object,display){
    let e=object;
	let o = object.style.display;
    //let v='none';
    switch(true){
        case (display!=undefined): v=display
            break;
        case (e.style.display_old!=undefined): v=e.style.display_old
            break;
        case (e.style.display=='none'): v=""
            break;
        default: v='none'
    };
    e.style.display=v
    e.style.display_old = o;
	return v
};

funIsInClick=function(x,y,rect){
	return (x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)?true:false
}

function funSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function funInfobubble(text,left,top,timer,btnname_func,fontSize,noPointer){
	fontSize = fontSize||""
	btntxte={"DE":"verstanden","EN":"understood"}
	htmlclassPointer = (noPointer)?'sprechblaseNoPointer':"sprechblase"
	blase = `<dl class="cmt"><dt class="name"></dt><dd class="${htmlclassPointer}"><div id="text">Du hast soeben das Cockpit geschlossen.<br><br>Hier findest du es wieder.<br><br>
	</div><div id="buttons" style="display: flex;position: absolute;right: 6px;bottom: 4px;"></div>
	</dd></dl>`
	infobubblecss = (typeof(infobubblecss)!='undefined')?infobubblecss:funAddHtmlE(document.head,'style',`
		dt.name {margin-left: 25px;margin-bottom: 20px;}
		dd.sprechblase {min-width: 83px;position: Relative;margin: 0 Auto;padding: 1rem;border-radius: 15px;background-color: #D6EBEB;}
		dd.sprechblase:before {content: ' ';position: Absolute;width: 0;height: 0;left: 28px;top: -17px;border-left: 14px Solid Transparent;border-right: 14px Solid Transparent;border-bottom: 17px Solid #D6EBEB;}
		
		dd.sprechblaseNoPointer {min-width: 83px;position: Relative;margin: 0 Auto;padding: 1rem;border-radius: 15px;background-color: #D6EBEB;}
		dd.sprechblaseNoPointer:before {position: Absolute;width: 0;height: 0;left: 28px;top: -17px;border-left: 14px Solid Transparent;border-right: 14px Solid Transparent;border-bottom: 17px Solid #D6EBEB;}
		`);
	infobubblebuttonparams = {display:'none',class:'linkfield'}
	text=text||"Das ist ein test"
	infobubble = (typeof(infobubble)!='undefined')?infobubble:funAddHtmlE(document.body,'div',blase,'infobubble',{style:'display:"none";z-index: 999;font: message-box;position:absolute;left:187px;'},null,true)
	infobubble.querySelector("dd").setAttribute("class",(noPointer)?'sprechblaseNoPointer':"sprechblase")
	infobubbletext = infobubble.querySelector("#text");
		infobubbletext.innerHTML = text+"<br><br>";
		infobubbletext.style.fontSize=fontSize
	infobubblebuttons = infobubble.querySelector("#buttons");
	infobubblebuttons.innerHTML = "";
	infobubble.style.display = ""
	if(left) infobubble.style.left = left+"px"
	if(top) infobubble.style.top = top+"px"
	if(!btnname_func) {btnname_func = {};btnname_func[btntxte[langKEY]]=()=>document.querySelector('#infobubble').style.display='none';}
	if(timer){
		funSleep(3000).then(()=>{infobubble.style.display='none'})
	}else{
		if(!btnname_func) {btnname_func = {};}
		for(n in btnname_func){
			let func
			if(btnname_func[n]==""){
				func = ()=>document.querySelector('#infobubble').style.display='none';
			}else{
				func = btnname_func[n]
			}
			const funct = func
			//console.log(n,btnname_func[n],funct)
			//funAddHtmlE(infobubblebuttons,"div",n,null,infobubblebuttonparams,{click:btnname_func[n]});
			funAddHtmlE(infobubblebuttons,"div",n,null,infobubblebuttonparams,{click:funct});
		}
		
	}
	for(n in btnname_func){
		//console.log(n,btnname_func[n])
	}
}

function funGerNumb (numb,digits){
    let ret = ((numb.toFixed(digits))*1)
    return ret.toLocaleString("de-DE")
}
//

function funDSP_CDS_to_Xmind(cdsexport){
    funDSPName=function(name,obj){
        return `\t${name} | ${obj[name]["@EndUserText.label"]}\n`
    }
    cds=cdsexport||x
    str=""
    for(n in x.editorSettings){str+=n+"\n"}
    sr=cds.definitions
    for (srn in sr){
        str+=funDSPName(srn,sr)
        e = sr[srn].elements
        for(en in e){
            str+="\t"+funDSPName(en,e)
        }
    
    
    
    }







    return str
}
//console.log(funDSP_CDS_to_Xmind())

datatypes={
    sapdatasheet:{
        index: function(name,td,obj){
            this.name = name;
            this.value = td.textContent.replaceAll(" ","")
            if(obj){obj[name]=this.value}
        },
        link: function(name,td,obj){
            this.name = name;
            tdd=td.querySelector("a")
            if(tdd){
                this.value = tdd.innerHTML
                this.link = tdd.href
            }
            if(obj){
                obj[name]=this.value;
                obj[name+"_link"]=this.link
            }
        },
        key: function(name,td,obj){
            this.name = name;
            this.value = td.querySelector("input").checked
            if(obj){
                obj[name]=this.value;
            }
        },
        numbe: function(name,td,obj){
            this.name = name;
            this.value = td.innerHTML.replaceAll(" ","");
            this.value = this.value.replace("&nbsp;","");
            if(obj){
                obj[name]=this.value;
            }
        },
        text: function(name,td,obj){
            this.name = name;
            this.value = td.innerHTML
            if(obj){
                obj[name]=this.value;
            }
        }
    },
}


function funReadTable(tblQry,headQry,bodyQry){
	tblQry=tblQry||"body > div:nth-child(2) > div > main > div > div.card-body.table-responsive.sapds-card-body > table:nth-child(11)"
    headQry=headQry||"th"
    bodyQry=bodyQry||"tbody > tr"
	tbl = document.querySelector(tblQry);
    let ret= [];
	head = tbl.querySelectorAll(headQry);
    lines = tbl.querySelectorAll(bodyQry);
    types= ["index","link","key","link","link","link","numbe","numbe","text","link"]
    lines.forEach(l=>{
        f=l.querySelectorAll("td")
            ret[f[1].querySelector("a").innerHTML]={}          
            //new datatypes.sapdatasheet.index("Index",f[0],ret[f[1].querySelector("a").innerHTML])        
		for(i=1;i<head.length;i++){
			n = head[i].innerHTML.replaceAll("<br>"," ");
			n = n.replace(" ","")
			new datatypes.sapdatasheet[types[i]](n,f[i],ret[f[1].querySelector("a").innerHTML])
		}
    })
	return ret
}
// x = funReadTable()


function funPrepareDataSet (objec) {
	//console.log("prepare",ob.data)
	if(objec.data) if(objec.data._class!='Dataset') if(typeof(Dataset)!='undefined') objec = new Dataset(objec)
		//console.log("prepare",objec)
	return objec
}

colors = {
	get:function(number=0,trnspaLevel=0,set=0){
		arr = ["one","two","three","four","five","six","seven","eight"]
		arr[-1]="negative"
		arr[false]="neutral"
		arr[true]="positive"
		set = "set_"+set
		return ""+this[set][arr[number]]+(this.transpaLevel[trnspaLevel]||"")
	},
	transpaLevel:['','a1','61','3d','24','14','0f'],
	set_1:{
		negative:"#C80F2D",
		positive:"#00823C",
		neutral:"#e96f00",
		one:"#56b4e9",
		two:"#009e73",
		three:"#f0e442",
		four:"#933242",
		five:"#666666",
		six:"#CCCCCC",
		seven:"#EE9E64",
		eight:"#95DABB",
	},
	set_2:{
	  "one": "#86C8FF",
	  "two": "#379FD9",
	  "three": "#0092E1",
	  "four": "#0071C5",
	  "five": "#005BAB",
	  "six": "#0047A0",
	  "seven": "#00398A",
	  "eight": "#002D74",
	  "negative": "#C75B60",
	  "positive": "#3A913F",
	  "neutral": "#D1A800"
	},
	set_0:{
	  "one": "#007032",
	  "two": "#5AA02C",
	  "three": "#E87722",
	  "four": "#BE1E2D",
	  "five": "#666666",
	  "six": "#CCCCCC",
	  "seven": "#E8A47E",
	  "eight": "#A5D9CE",
	  "negative": "#C75B60",
	  "positive": "#3A913F",
	  "neutral": "#A29521"
	},
}




funAddTableArrObjLimit = 100;
funAddTableArrObj_shown=[];
//objAddTableArrObj = {}
funAddTableArrObj = async function  (contelem,arr_obj,keycol,skip=0,level=0){
	//if(arr_obj.data==undefined) console.log("funAddTableArrObj only .data / not an object ")
	let t_arrobj = (arr_obj.data)?funPrepareDataSet(arr_obj).data:funPrepareDataSet({data:arr_obj}).data //.copy()
	if(!(t_arrobj)) {
		t_arrobj={Error:"Keine Werte"};
		console.log("Keine Werte: ",arr_obj)
	}
	if(Array.isArray(t_arrobj) && t_arrobj.length==0) t_arrobj.push({Error:"Keine Werte"})
	const arrobj = t_arrobj
	const kc = arrobj._keyColumn
	const sc = arrobj._sortColumn || ""
	const rowFunc = arrobj._rowFunction||function(){}
	const next = arrobj._next||function(){}
	//const odctx = arrobj['_@odata.context']
	let columnTypes = arrobj._columnTypesForTable || arr_obj._columnTypesForTable || {}
	let merker = 0;
	let counters = {}
	
	let TabelHeaderNames = arrobj._funTabelHeaderNames || funTabelHeaderNames
	//arrobj['_columnInfo'] = {}
	arrobj['_columnInfo'] = arrobj['_columnInfo'] || arr_obj['columnInfo'] || arrobj['_@odata.context'];
	
	getValueField = function(dataCell,n,field,src){
		let v = dataCell
		let tdata = field//document.createElement('td');
		let htmlObject = {
			type:"div",
			title:n+"\n"+v,
			id:n,
			value:v
		}
		cty = columnTypes[n]||{}
		for(p in cty){
			htmlObject[p] = cty[p]
		}
		if(htmlObject.valueMatcher!=undefined){ 
			Object.keys(htmlObject.valueMatcher).forEach(m=>{
				if(m=='undefined') return
				if(v.match(m)!=null) Object.keys(htmlObject.valueMatcher[m]).forEach(p=>{
					htmlObject[p] = htmlObject.valueMatcher[m][p]})
				})
			delete htmlObject.valueMatcher
		}
		if(htmlObject.stringMatcher!=undefined){ 
			Object.keys(htmlObject.stringMatcher).forEach(m=>{
				if(m=='undefined') return
				if(v.match(m)!=null) Object.keys(htmlObject.stringMatcher[m]).forEach(p=>{
					htmlObject[p] = htmlObject.stringMatcher[m][p]})
				})
			delete htmlObject.stringMatcher
		}
		if (typeof(v)=='boolean' || v == 'true' || v == 'false') {
			v = v.toString()
		}else if(typeof(v)=='number'){
			counters[n]=counters[n]||0;
			counters[n]+=v
			v=funGerNumb(v,2);
		}else if(typeof(v)=='string'){
			if(v.startsWith("<")){
				tdata.title = ''
				delete htmlObject.title
			}
			if(new Date(v)!="Invalid Date" && v.length ==24 && v.charAt(10)=='T' && v.charAt(23)=='Z'){
				v=new Date(v)
				v=(v.getHours()+v.getMinutes()+v.getSeconds() == 0)?v.toLocaleDateString():v.toLocaleString()
			}else if((v.match(/^-?\d*\.\d*$/))){
				v = (v*1)
				counters[n]=counters[n]||0;
				counters[n]+=v
				v = funGerNumb(v,2);
			}else{}
		}else if(new Date(v)!='Invalid Date' && v!=null){
			v = new Date(v)
			v=(v.getHours()+v.getMinutes()+v.getSeconds() == 0)?v.toLocaleDateString():v.toLocaleString()
		}else{} 
		
		if(typeof(v)=='object' && v!=null){
			//console.log("object",tdata)
			let tit = "object"//n+"\n"+JSON.stringify(v);
			const cklElem = funAddHtmlE(tdata,"div",'&#9776;',n,{title:tit,onclick:'funChangeDisplayObject(this.parentElement.querySelector("div#hide"))'})
			let sc = funAddHtmlE(tdata,"div",'','hide',{style:'display:none;'})
			if(src=='obj') {
				funAddTableArrObj(sc,v,null,null,1)
			}else{
				const functionone = ()=>{funAddTableArrObj(sc,v,null,null,1)}
				cklElem.addEventListener("click",functionone, { once: true })
			}
		}else{
			
		
		//if(htmlObject){
			const {type, ...rest } = htmlObject
			funAddHtmlE(tdata,type,v,"",rest)
		}
		return tdata
	};
	
	funAddTableObj=function(contelem,ob){
		//console.log("funAddTableObj",contelem)
		let cont = contelem;
		let t = funAddHtmlE(cont,"table")
		let h = funAddHtmlE(t,"thead")
		let b = funAddHtmlE(t,"tbody")
		rowFunc(b,ob)
		for(n in ob){
			if(n.startsWith("_")) {b.setAttribute(n,ob[n]);continue;}
			let r = funAddHtmlE(b,"tr")
			funAddHtmlE(r,"td",n)
			let el = funAddHtmlE(r,"td")
			getValueField(ob[n],n,el,"obj")
		
			//r.appendChild(holeElem);
		}
		funTabelHeaderNames(t,arrobj['_columnInfo'])
		//get_info_dlink(obj['@odata.context']);
	};
	
	if(arrobj.length==1 || (typeof(arrobj)=='object' && !Array.isArray(arrobj))) {
		let o = (typeof(arrobj)=='object' && !Array.isArray(arrobj))?arrobj:arrobj[0] 
		funAddTableObj(contelem,o); 
		return
	}
	
	contentIsString = typeof(arrobj[0]) !='object'
	
	let same = (contelem.tagName == 'TBODY')?true:false;
	let limit = funAddTableArrObjLimit + skip;
	
	let cont =(same)?contelem.parentElement.parentElement:contelem
	let t,h;
	
	//console.log("ORIGIN same:",same)
	
	if(!same) {
		cont.innerHTML = '';
		t = funAddHtmlE(cont,"table","","dtable",null,null)
		cntr = funAddHtmlE(t,"thead")
		h = funAddHtmlE(t,"thead")
		if(!contentIsString){
			funAddHtmlE(h,"th",kc)
			funAddHtmlE(cntr,"th","")
			for(n in arrobj[0]){
				if(!(n.startsWith("_"))) {
					if(n==kc) continue;
					funAddHtmlE(cntr,"th","","cnt_"+n)
					funAddHtmlE(h,"th",n)
				}
			}
			//funAddHtmlE(cont,"div","Es werden die Datensätze von " + (skip+1) + " bis <text id='counter'>0</text> Datensätze von "+arrobj.length+" angezeigt",null,null,null,true)
			inf = funAddHtmlE(cont,"div",null,null,null,null,true)
			funAddHtmlE(inf,"text","Es werden <text id='counter'>0</text> Datensätze von "+arrobj.length+" angezeigt",null,null,null)
			funAddHtmlE(inf,"button","download",null,{onclick:"funSaveAsFile(obj.data)"})
		}
	}else{
		
	}
	
	const b = (same)?contelem:funAddHtmlE(t,"tbody")
	//cont = b.parentElement
	
	//console.log("cont:",cont)
	if(contentIsString) {
		if(typeof(arrobj)== "string"){
			let r = funAddHtmlE(b,"tr")
			funAddHtmlE(r,"td",arrobj);
		}else{
			arrobj.forEach(str=>{
				let r = funAddHtmlE(b,"tr")
				funAddHtmlE(r,"td",str);
		
			})
		}
	}
	
	let btn_next = cont.querySelector("button#next")
	if(btn_next!=null) btn_next.remove()
	
	if(!contentIsString) arrobj.sortByKeyColumns([sc]).forEach((obj,i)=>{
		if(i < skip) return
		if(i==limit) {
			const skipper = i+1
			funAddHtmlE(cont,"button","die nächsten anzeigen","next",{},{click:(ev)=>{funAddTableArrObj(b,arrobj,kc,skipper,1);ev.srcElement.remove()}})
			return
		}
		if(i>=limit) return
		cont.querySelector("text#counter").innerHTML = (i+1)
		merker++
		let r = funAddHtmlE(b,"tr")
		rowFunc(r,obj)
		n=kc;
		//funAddHtmlE(r,"td",obj[n],n,{title:n+"\n"+obj[n]})
		getValueField(obj[n],n,funAddHtmlE(r,"td"));
		for(n in obj){
			if(n.startsWith("_")) {r.setAttribute(n,obj[n]);continue;}
			if(n==kc) continue;
			//r.appendChild(getValueField(obj[n],n));
			getValueField(obj[n],n,funAddHtmlE(r,"td"));
			continue;
		}
		
	});
	//if(level==0 && odctx) get_info_dlink(odctx);
	if(level==0) funAddTableArrObj_shown = arrobj
	if(arrobj._calculationFunctions){
		arrobj._calculationFunctions.forEach(clf=>{
			func = (d,e)=>{try{eval(clf[1])}catch(err){}}
			func(null,counters)
		})
		}
	for(cn in counters){
		try{cntr.querySelector("#cnt_"+funCleanMatcher(cn)).innerHTML = funGerNumb(counters[cn],2)}catch(err){}
	}
	
	TabelHeaderNames(t,arrobj['_columnInfo'])
	
	return t
}


/* function funAddTableObj(contelem,obj){
	cont = contelem;
	
	let t = funAddHtmlE(cont,"table")
	let h = funAddHtmlE(t,"thead")
	let b = funAddHtmlE(t,"tbody")
	for(n in obj){
		let r = funAddHtmlE(b,"tr")
		funAddHtmlE(r,"td",n)
		funAddHtmlE(r,"td",obj[n],n,{title:n+"\n"+obj[n]})
	}
	get_info_dlink(obj['@odata.context']);
} */

funSPJSONdata={
    obj:{},
    l:'https://moldtecs.sharepoint.com/sites/moldtecs/Loc/mhson/func/fert/cip/',
    n:'sap_tables',
    ln:"jsondata",
    qry:'',
    id:"1",
    init:function(name){
        n=name||'sap_tables';
        this.qry = '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+n+'</Value></Eq></Where></Query></View>'
    },
    get_value:function(followupfunction){that=this;
        if(this.qry=="") this.init()
        ctx = new SP.ClientContext(this.l)
        list = ctx.get_web().get_lists().getByTitle(this.ln);
        query = new SP.CamlQuery();
		query.set_viewXml(this.qry);
        items = list.getItems(query);
        ctx.load(items);
        ctx.executeQueryAsync(
            function(){
                obj = items.get_item(0).get_fieldValues();
                that.string = obj.value
                that.id = obj.ID
                that.value = JSON.parse(obj.value)
                console.log(that)
            },function(sender,args){console.log(args.get_message())})
    },
    set_value:function(strORobj){that=this;
        if(typeof(strORobj)=="object"){
            console.log("obj")
            nV = JSON.stringify(["neu",new Date().toLocaleString("de-DE")])
        }
        else if(typeof(strORobj)=="string"){
            console.log("string")
            nV = strORobj
        }
        else{return false}
        ctx = new SP.ClientContext(this.l)
        web = ctx.get_web()
        list = web.get_lists().getByTitle(this.ln);
        listItem = list.getItemById(this.id);
        listItem.set_item('value', nV);
        listItem.update();
        ctx.executeQueryAsync(successHandler, errorHandler);
            function successHandler() {that.get_value()/*console.log('List item updated successfully')*/;}
            function errorHandler(sender, args) {console.log(args.get_message());}
        
    }
}

nu = {}

funSPJSONdata.init('sap_tables')
//funSPJSONdata.set_value("{'TEST':'WERT'}");
//funSPJSONdata.set_value(nu)

// ==============================> Experimental or Not Working
function funTabelHeaderNames(table,columnInfos){
		if(!(table)) return
		t = (table.querySelectorAll("th").length>0)?document.querySelectorAll("th"):table.querySelectorAll("tbody tr td:first-child")
		t.forEach(r=>{
			f = r
			n = f.innerHTML
			f.title = n
			try{
				n = columnInfos[n].stxt
			}catch{}
			f.innerHTML = n||f.innerHTML
		})
}

function funCopyToClipboard(qry_str) {
    // Text aus dem Element auswählen
    var copyText = document.querySelector(qry_str);
    var range = document.createRange();
    range.selectNode(copyText);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Versucht, den ausgewählten Text zu kopieren
    try {
        var successful = document.execCommand('copy');
        var message = successful ? 'Kopiert!' : 'Fehler beim Kopieren';
        //console.log(message);
    } catch (err) {
        console.error('Fehler beim Kopieren: ', err);
    }

    // Die Auswahl aufheben
    window.getSelection().removeAllRanges();
}

function funXMLToJson(xml) {  
  xml = new DOMParser().parseFromString(xml, 'text/xml');
  
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
      return text + node.nodeValue;
    }, "");
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = funXMLToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(funXMLToJson(item));
      }
    }
  }
  return obj;
}

function flatMapUnique(array, callback) {
  return [...new Set(array.flatMap(callback))];
}

function findProperty(obj, key) {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }
    for (let k in obj) {
        if (typeof obj[k] === "object" && obj[k] !== null) {
            const result = findProperty(obj[k], key);
            if (result) {
                return result;
            }
        }
    }
    return null;  // Wenn die Eigenschaft nicht gefunden wurde
}

function xmlToJson(xml) {
	if(!(xml)) return xml
    let obj = {};  // Verwenden von 'let' anstelle von 'const'
    if (xml.nodeType === 1) { // Element
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // Text
        obj = xml.nodeValue.trim(); // Dies könnte zu einem Problem führen, wenn 'obj' bereits definiert ist, daher 'let' verwenden
    }
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof obj[nodeName] === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (!Array.isArray(obj[nodeName])) {
                    obj[nodeName] = [obj[nodeName]]; // Konvertierung in Array, wenn nicht bereits eins
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

function get_info_dlink(info_link){
	if(!(info_link)) return
	const infolink = info_link||window.location.href.split('/').slice(0, 10).join('/')+'/$metadata' //window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/$metadata"
	if(infolink.startsWith("file:")) return 
	if(infolink.match("C:/Users/")) return 
	if(infolink.match("https://mutares.eu10.hcs.cloud.sap/")==null) return
	funGetNames = function(){
		//if(arrOrObj=='obj')
		//t = document.querySelectorAll("tbody tr td")
		t = (document.querySelectorAll("th").length>0)?document.querySelectorAll("th"):document.querySelectorAll("tbody tr td")
		t.forEach(r=>{
			f = r
			n = f.innerHTML
			f.title = n
			try{
				n = obj.columninfos[n].stxt
			}catch{}
			f.innerHTML = n||f.innerHTML
		})
	};
	if(obj.columninfos) return funGetNames()
	const xhr = new XMLHttpRequest();
	xhr.open("GET", infolink, true);
	xhr.onreadystatechange = function () {
	  if (xhr.readyState === 4 && xhr.status === 200) {
		const xmlDoc = xhr.responseXML;
		let colm = {}
		// XML in JSON konvertieren
		const jsonObject = xmlToJson(xmlDoc);

		// JSON-Objekt ausgeben (z.B. in der Konsole)
		console.log(jsonObject);
		
		a = jsonObject['edmx:Edmx']['edmx:DataServices']['Schema']['Annotations']
		a.forEach(b=>{
			str = b['@attributes'].Target
			f = str.split("/")[1]
			b.stxt = findProperty(b,"String")
			if(f){
				//console.log(f,b)
				colm[f]=b
			}
		})
		obj.columninfos = colm
		if(electron){
			//console.log(obj)
			ipc.invoke("dlink", obj);
		}else{
			funGetNames();
		}
		console.log(colm);
	  }
	};
	xhr.send();
}


function get_info_dlink_prom(url){
    return new Promise((resolve, reject) => {
		if(!(url)) resolve({})
		if(url.match("https://mutares.eu10.hcs.cloud.sap/")==null) resolve({})
		if(url.startsWith("file:")) resolve(null)
        const xhr = new XMLHttpRequest();
    	xhr.open("GET", url, true);
    	xhr.onreadystatechange = function () {
    	  if (xhr.readyState === 4 && xhr.status === 200) {
    		const xmlDoc = xhr.responseXML;
    		let colm = {}
    		// XML in JSON konvertieren
			if(xmlDoc==null || !(xmlDoc)) return resolve({})
    		const jsonObject = xmlToJson(xmlDoc);
            a = jsonObject['edmx:Edmx']['edmx:DataServices']['Schema']['Annotations']
    		a.forEach(b=>{
    			str = b['@attributes'].Target
    			f = str.split("/")[1]
    			b.stxt = findProperty(b,"String")
    			if(f){
    				//console.log(f,b)
    				colm[f]=b
    			}
    		})
            let inputArray = []
            b = jsonObject['edmx:Edmx']['edmx:DataServices']['Schema']['EntityType']
			if(!Array.isArray(b)) b = [b]
            b.forEach(c=>{
				if(!Array.isArray(c.Property)) c.Property = [c.Property]
                c.Property.forEach(el=>{
                    //d.forEach(el=>{
                        
                    d = el['@attributes']
					colm[d.Name]=colm[d.Name]||{}
                    colm[d.Name].columnProperty = d
                    //})
                })
            })
            if (b[1]!=undefined) {
				let arr = b[1].Key.PropertyRef
				if(!Array.isArray(arr)) arr = [arr]
				arr.forEach(el=>{
                    inputArray.push(el['@attributes'].Name)
                })
			}

            let columnArr = []
            
            for(n in colm){
                prop = (colm[n].columnProperty)?(colm[n].columnProperty):{}
                columnArr.push({
                    name:n,
                    label:colm[n].stxt,
                    MaxLength:prop.MaxLength,
                    Type:prop.Type,
                    Nullable:prop.Nullable
                })
            }

            
            let obj = {
                columns: colm,
                inputs: inputArray,
                origin: jsonObject,
                columnArr:columnArr
            } 
            arr=obj
            resolve(obj)
            
        	};
        }
	xhr.send();
    })
}

function funexplodeBOM(bomArr){
	try{
    bomArr = bomArr||bom
	}catch(err){console.log("no Bom")}
    let bomexpl={}
    bomArr.forEach(b=>{
        let level=bomexpl
        let lev = b.BOM_ID.split("_")
        lev.forEach((l,i)=>{
            if(i==0) return
            if(i==1) {l=b.FG_MATNR}else{l="_"+l}
            if(i==2) return
            //if(i==lev.length-2) l=l+" - "+b.MATNR
            //if(i==lev.length-1) l=l+" - "+b.BI_IDNRK
            level[l]=level[l]||{}
            level=level[l]
            if(i==lev.length-1){level[b.BI_IDNRK]=b;return}
        })
        
    })
    return bomexpl
}

function funexplodeBOMforChart(bomArr) {
    let bomexpl = {
        name: bomArr[0].FG_MATNR,
        children: []
    };

    let nodeMap = new Map(); // Zum schnellen Zugriff auf existierende Knoten

    bomArr.forEach(line => {
        let keys = line["BOM_ID"].split("_").slice(3); // Überspringt die ersten 3 Werte
        let level = bomexpl;

        let path = "";
        keys.forEach((el, i) => {
            if (i % 2 !== 0) return; // Überspringe ungerade i-Werte
            path += (i > 0 ? "_" : "") + el; // Eindeutiger Schlüssel für den Pfad

            if (!nodeMap.has(path)) {
                let newNode = { id: el, children: [] };
                level.children.push(newNode);
                nodeMap.set(path, newNode);
            }

            level = nodeMap.get(path);
        });

        level.name = line.BI_IDNRK; // Setzt den Namen nur beim letzten Element
		level.element = line
    });

    return bomexpl;
}

function funarr_objectsEqual(obj1, obj2, arrkeyColumns) {
  return arrkeyColumns.every(key => obj1[key] === obj2[key]);
}

function funarr_reverseArray(arr) {
  return arr.slice().reverse(); // slice() erstellt eine Kopie des Arrays, um das Original nicht zu verändern
}


function funarr_sortByKeyColumns(arr, arrkeyColumns) {
  return arr.sort((a, b) => {
    for (let key of arrkeyColumns) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0; // wenn alle gleich sind
  });
}

function funSaveAsFile(arr, name = 'export', type, extension, headerText) {
    let destroyModal = function () {
        const overlay = document.getElementById('overlay');
        const modal = document.getElementById('modal');
        if (overlay) overlay.remove();
        if (modal) modal.remove();
    }

    let n = name;
    //let headerText = '';

    // Modal und Overlay erstellen, wenn kein Typ angegeben ist
    if (!type) {
        if (!document.getElementById('modal')) {
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '999';
            overlay.style.display = 'block';
            document.body.appendChild(overlay);

            const modal = document.createElement('div');
            modal.id = 'modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = 'white';
            modal.style.padding = '20px';
            modal.style.borderRadius = '8px';
            modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            modal.style.textAlign = 'left';
            modal.style.zIndex = '1000';
            modal.style.display = 'block';
            modal.style.maxWidth = '400px';
            modal.style.width = '100%';

			// Schließen-Button hinzufügen
			const closeButton = document.createElement('button');
			closeButton.innerHTML = '&times;';
			closeButton.style.position = 'absolute';
			closeButton.style.top = '10px';
			closeButton.style.right = '10px';
			closeButton.style.border = 'none';
			closeButton.style.background = 'none';
			closeButton.style.fontSize = '20px';
			closeButton.style.cursor = 'pointer';
			closeButton.onclick = destroyModal;
			modal.appendChild(closeButton);

            const createInput = (label, id, value = '') => {
                const div = document.createElement('div');
                div.style.marginBottom = '10px';
                const labelElement = document.createElement('label');
                labelElement.htmlFor = id;
                labelElement.innerText = label;
                labelElement.style.display = 'block';
                labelElement.style.marginBottom = '5px';
                const input = document.createElement('input');
                input.type = 'text';
                input.id = id;
                input.value = value;
                input.style.width = '100%';
                input.style.padding = '5px';
                input.style.boxSizing = 'border-box';
                div.appendChild(labelElement);
                div.appendChild(input);
                return div;
            };

            modal.appendChild(createInput('Dateiname:', 'fileName', n));
            modal.appendChild(createInput('Dateiendung:', 'fileExtension'));
            
            const headerDiv = createInput('Text am Dateianfang:', 'headerText');
            const headerInput = headerDiv.querySelector('input');
            headerInput.style.height = '60px';
            modal.appendChild(headerDiv);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.textAlign = 'center';
            buttonContainer.style.marginTop = '20px';

            const createButton = (text, onClick) => {
                const button = document.createElement('button');
                button.innerText = text;
                button.style.margin = '5px';
                button.style.padding = '10px 20px';
                button.style.fontSize = '16px';
                button.style.cursor = 'pointer';
                button.onclick = onClick;
                return button;
            };

            const saveFile = (fileType) => {
                n = document.getElementById('fileName').value || 'export';
                const extension_ = document.getElementById('fileExtension').value || fileType;
                headerText_ = document.getElementById('headerText').value;
                funSaveAsFile(arr, n, fileType, extension_, headerText_);
            };

            buttonContainer.appendChild(createButton('Als JSON speichern', () => saveFile('json')));
            buttonContainer.appendChild(createButton('Als CSV speichern', () => saveFile('csv')));

            modal.appendChild(buttonContainer);

            document.body.appendChild(modal);
        } else {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal').style.display = 'block';
        }
        return;
    }

    destroyModal();

    let objData;

    // Daten in das entsprechende Format konvertieren
    if (type === "json") {
        objData = JSON.stringify(arr, null, 2);
    } else if (type === "csv") {
        objData = funArrayToCSV(arr);
    } else {
        console.error("Unsupported file type");
        return;
    }

    // Headertext hinzufügen, wenn vorhanden
    if (headerText) {
        objData = headerText + objData;
    }
	
	
	
    let blob = new Blob([objData], { type: 'text/plain' });

    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = `${n}.${extension||type}`;
    a.click();

    URL.revokeObjectURL(url);
}

function funArrayToCSV(arr) {
	let formatValue = function(value) {
		if (typeof value === 'number') {
			// Konvertieren ins deutsche Zahlenformat
			return value.toLocaleString('de-DE', { minimumFractionDigits: 2 }).replace('.', ',');
		}
		return `"${value}"`;
	}

    if (!Array.isArray(arr) || arr.length === 0) return '';

    const keys = Object.keys(arr[0]);
    const csvRows = [];
    const delimiter = ';';  // Semikolon als Trennzeichen

    csvRows.push(keys.join(delimiter));

    arr.forEach(row => {
        const values = keys.map(key => formatValue(row[key]));
        csvRows.push(values.join(delimiter));
    });

    return csvRows.join('\n');
}

var sqlStringTypes = [
  "CHAR",
  "VARCHAR",
  "TEXT",
  "TINYTEXT",
  "MEDIUMTEXT",
  "LONGTEXT",
  "NCHAR",
  "NVARCHAR",
  "NTEXT",
  "LONGVARCHAR"
];

Date.prototype.funGetIsoWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  var week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7);
};
Date.prototype.funGetGroupByMonth=function(actMonthAsEasyBoolean){
	var d = new Date(this);
	m_act = new Date().getMonth()
	if(d.getMonth()<m_act) return funDatum.getMonthName(d.getMonth())
	if(actMonthAsEasyBoolean) return funDatum.getSimpelDate(d)
	return funDatum.getMonthName(d.getMonth())
};
Date.prototype.addDays=function(days){
    d=this
    d=new Date(d)*1
    days=days||0
    return new Date(d+(60*60*1000*24*days))  
};

Array.prototype.sortByKeyColumns=function(arrkeyColumns,arrDirections) {
	if(!(arrkeyColumns)) return this
	if(arrkeyColumns[0] == "") return this
	
  return this.sort((a, b) => {
    for (let key of arrkeyColumns) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0; // wenn alle gleich sind
  });
}
Array.prototype.sortByKeyColumns=function(arrkeyColumns,arrDirections=[]) {
	if(!(arrkeyColumns)) return this
	if(arrkeyColumns[0] == "") return this
	let newA = []
	arrkeyColumns = funarr_reverseArray(arrkeyColumns)
	arrDirections.length = arrkeyColumns.length
	arrDirections = funarr_reverseArray(arrDirections)
	arrkeyColumns.forEach((k,i)=>{
		newA = this.sortByKeyColumWithOrder(k,arrDirections[i]||null)
	})
	return newA
}
Array.prototype.sortByKeyColumWithOrder=function(keyColumn,direction = 'asc') {
	if(!(keyColumn)) return this
	if(direction == 'desc') return this.sort((b, a) => {
		  if (a[keyColumn] < b[keyColumn]) return -1;
		  if (a[keyColumn] > b[keyColumn]) return 1;
		return 0; // wenn alle gleich sind
	  });
	return this.sort((a, b) => {
		  if (a[keyColumn] < b[keyColumn]) return -1;
		  if (a[keyColumn] > b[keyColumn]) return 1;
		return 0; // wenn alle gleich sind
	});
}

Array.prototype.copy = function(){
    let origin = [];
	for(p in ([])){origin.push(p)}
	let arr = [...this]
    for(p in this){
		if(origin.indexOf(p)==-1) arr[p] = this[p]
    }
    return arr
}

Array.prototype.getColumns = function(columnArr){
    let origin = [];
	for(p in ([])){origin.push(p)}
	let arr = [...this]
    let keys = columnArr||Object.keys(arr[0]);
    
    arr = arr.map(obj =>
      Object.fromEntries(keys.map(key => [key, obj[key]]))
    );
    for(p in this){
        if(Number.isNaN(Number(p)) && origin.indexOf(p)==-1) arr[p] = this[p]
    }
    return arr
};

/* Object.prototype.delete=function(property){
    let ret = this[property]
    delete this[property]
    return ret
}
 */
//Object.prototype.copy = function(){return {...this}}



datasphereSQL = function(){
    get = function(month,col="",nameInd=[0,1]){
        let qt = col!=""
        names = ["AMOUNT","QUANTITY"]
        let col1 = `"${col}2025${month}" AS "${names[nameInd[0]]}"`
        let col2 = `NULL AS "${names[nameInd[1]]}"`
        let s = (month=='01' && col=="")?'':"   UNION ALL"
        return s + `
        SELECT
            "Index" AS INDEX,
            "Material Number" AS MATNR,
            "Plant" AS WERKS,
            "Sales-to Customer" AS KUNNR,
            "Ship-to Customer" AS KUNNR_WE,
            "OEM/OES" AS VTWEG,
            '2025' AS YEAR,
            'Budget' AS SRCFILE,
            'EUR' AS WAERS,
            "Unit" AS "MEINS",
            '${col}2025${month}' AS SRCCOL,
            '2025${month}' AS "PERIOD",
            ${(qt)?col2:col1},
            ${(qt)?col1:col2}
        FROM "MT_SOURCE_FILE.MT_FILE_IL_TR_PC_BUDGET_EU_2025"
		`;
    }
    str = ""
    for(i=1;i<13;i++){
        str+=get(funDatum.fuehrNull(i));
        str+=get(funDatum.fuehrNull(i),"Q_",[1,0])
    }
    return str
}
//datasphereSQL()


var classContextMene
classContextMene = classContextMene || class classContextMene{
	lis={};
	show_rigthclick(ev){
		if (ev.button === 2) this.show(ev)			
	};
	show=function(ev){
		this.show_fmt(ev)
		const contextMenu = this.div 
		// Schließen des Menüs bei Klick außerhalb
		document.addEventListener('click', () => {
			contextMenu.style.display = 'none';
		}, { once: true });
	};
	show_fmt=function(ev){
        try{
			// Kontextmenü nur bei Rechtsklick anzeigen
			//if (ev.button === 2) {}
			//const contextMenu = document.getElementById('context-menu');
			//if (!contextMenu) return;
			const contextMenu = this.div 
			// Menü anzeigen und dynamisch positionieren
			contextMenu.style.display = 'block';
			const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
			const { offsetWidth: menuWidth, offsetHeight: menuHeight } = contextMenu;

			const positionX = x + menuWidth > windowWidth ? x - menuWidth : x;
			const positionY = y + menuHeight > windowHeight ? y - menuHeight : y;

			contextMenu.style.left = `${Math.max(0, positionX)}px`;
			contextMenu.style.top = `${Math.max(0, positionY)}px`;

			// Dynamische Anpassung der Untermenüs
			const submenus = contextMenu.querySelectorAll('.submenu');
			submenus.forEach((submenu) => {
				const parentLi = submenu.closest('li');

				// Klasse zurücksetzen
				submenu.style.left = '';
				submenu.style.top = '';
				parentLi.classList.remove('submenu-left', 'submenu-up');

				// Temporär anzeigen für Berechnungen
				submenu.style.display = 'block';
				const submenuRect = submenu.getBoundingClientRect();
				const { right, bottom } = submenuRect;
				submenu.style.display = '';

				// Links ausrichten, wenn kein Platz rechts
				if (right > windowWidth) {
					parentLi.classList.add('submenu-left');
					submenu.style.left = `-${submenuRect.width}px`;
				}

				// Nach oben ausrichten, wenn kein Platz unten
				if (bottom > windowHeight) {
					parentLi.classList.add('submenu-up');
					submenu.style.top = `-${submenuRect.height}px`;
				}
			});


				// Schließen des Menüs bei Klick außerhalb
				/*document.addEventListener('click', () => {
					contextMenu.style.display = 'none';
				}, { once: true });
		*/
				// Keine weitere Verarbeitung des Klicks
				//return;
			
		}catch(err){console.log(err)}
    };
	hide=function(){
			this.div.style.display = 'none'
	};
    fill_fmt=function(ev,arr,mother){try{
		let build_links,lin,nam;
		this.clear()
		
		if(arr.length>1) {
			arr.forEach((o,i)=>{
				dab.contextMenueObj.add_li(o.ordername,{"onclick":"dab.contextMenueObj.fill_fmt(null,[fmt.values["+i+"]],fmt.values)"})
			})
			return
		}
		
		if(mother) if(mother.length>1) dab.contextMenueObj.add_li("Zurück",{"onclick":"dab.contextMenueObj.fill_fmt(null,fmt.values)"})
		let lvl = null
		let obj = arr[0]
		let n=obj.name
		let fmScreens=dashboard.fmScreens.filter(l=>l.name.match(new RegExp(n)))

		let categoryHtmlStyle = 'background: rgba(236, 236, 236, 0.9);text-align: right;padding-right: 8px;'

		let o = obj
		n=obj.name;
		const matNr=o.product_name
		const machine_name = o.name
		
		lvl = dab.contextMenueObj.add_li(o.ordername)
		build_links=function(name,fields){
			funAddHtmlE(lvl.ul.el,"div",name,null,{style:categoryHtmlStyle})
				fields.forEach(f=>{
					let v = o[f]
					dab.contextMenueObj.add_li_on_li(o[f],{class:"infofield",title:f},{click:()=>{dab.filter_all(f,v)}})
				})
		}
		build_links("Orderinfo",["order_description","parent_order_name","product_group_name"])
		build_links("Machine und Staus",["name","machine_description","machinestatusname","prod_status_remark"])
		build_links("Remarks",["prod_shift_remark","prod_order_remark"])
		build_links("Quantitys",["units_per_hour","units_good_since_shift_begin","units_scrap_since_shift_begin","units_gross_since_shift_begin"])
		build_links("KPIs",["oee_percent_since_shift_begin","performance_factor_since_shift_begin","quality_factor_since_shift_begin","availability_factor_since_shift_begin"])
		
		
		
		
		
		funLinks.fmdas = {get_name:function(){return "FM Links"},links: fmScreens};
		lin = ["fmdas","links"]
			o = funLinks[lin[0]][lin[1]]
			nam=funLinks[lin[0]].get_name()
		dab.contextMenueObj.add_li(nam)
			for(n in o){
				dab.contextMenueObj.add_li_on_li(o[n].name+"&#10149;",{"onclick":"dashboard.buttons['"+o[n].name+"'].click()"})
			}
		lvl = dab.contextMenueObj.add_li("Links")
		build_links = function(lin){
			o = funLinks[lin[0]][lin[1]]
			nam=funLinks[lin[0]].get_name()
			funAddHtmlE(lvl.ul.el,"div",nam,null,{style:categoryHtmlStyle})
			//dab.contextMenueObj.add_li(nam)
			for(n in o){
				dab.contextMenueObj.add_li_on_li(o[n].get_name()+"&#10149;",{class:"","onclick":"funLinks."+lin[0]+"['"+n+"']('"+matNr+"')"})
			}
		}
		build_links(["sap","transactions"])
		build_links(["dasp_link","materiallinks"])
		build_links(["pwrbi_link","materiallinks"])
		build_links(["cdb","materiallinks"])
		
		
		const func = (electron)?"function(data){ipc.invoke('dlink',{data:{value:data}})}":"function(data){console.log(data)}"
		
		
		//if(electron) {
			lvl = dab.contextMenueObj.add_li("Cockpit")
			dab.contextMenueObj.add_li_on_li("machine_performance_indicators",{onclick:"dab.requests.chart_machine_performance_indicators.get({machine_name:'"+machine_name+"',followUpFunction:"+func+"})"})//dab.requests.chart_machine_performance_indicators.get(machine_name,func)})
			dab.contextMenueObj.add_li_on_li("machinestatus_history",{onclick:"dab.requests.chart_machinestatus_history.get({machine_name:'"+machine_name+"',followUpFunction:"+func+"})"})//dab.requests.chart_machine_performance_indicators.get(machine_name,func)})
			dab.contextMenueObj.add_li_on_li("shift_performance",{onclick:"dab.requests.chart_shift_performance.get({machine_name:'"+machine_name+"',followUpFunction:"+func+"})"})//dab.requests.chart_machine_performance_indicators.get(machine_name,func)})
			dab.contextMenueObj.add_li_on_li("machinedata_history",{onclick:"dab.requests.chart_machinedata_history.get({machine_name:'"+machine_name+"',followUpFunction:"+func+"})"})//dab.requests.chart_machine_performance_indicators.get(machine_name,func)})
			dab.contextMenueObj.add_li_on_li("repeat",{},{click:()=>{
				let obj = request.param
				let str = ''
				for(n in obj){
					str+=`${n}=${obj[n]}&`
				}
				fetch("https://dashboard001.factoryminer.com/framework/scripts/app_portal.php", {
				  "headers": {
					"accept": "*/*",
					"accept-language": "de",
					"cache-control": "no-cache",
					"content-type": "application/x-www-form-urlencoded",
					"pragma": "no-cache",
					"sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\"",
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": "\"Windows\"",
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-origin"
				  },
				  "referrer": "https://dashboard001.factoryminer.com/framework/scripts/app_portal.php",
				  "referrerPolicy": "strict-origin-when-cross-origin",
				  "body": str,
				  "method": "POST",
				  "mode": "cors",
				  "credentials": "include"
				}).then(response => response.json())
				.then(data => ipc.invoke('dlink',{data:{value:data}}))
				.catch(error => console.error('Error:', error));
			}})
		
		
		return
		
			
			if((app=='dashboard.factoryminer.com' || app=='dashboard001.factoryminer.com') && iframe.active == true) {
				iframe.build()
			}else{
				//ad(c,"p","init.iframe()","",{class:"linkfield","onclick":"init.iframe()"})
			}
			
			
			
    }catch(err){console.log(err)}
	};
    clear=function(){
        this.ul.innerHTML="";
    };
    add_li_on_li=function(name,options,event_func,li){
		let level0 = li || this.lastLevel0
		let o = options||{}
		let ul = level0.ul//||{el:funAddHtmlE(level0.el,"ul","","",{class:"submenu"}),lis:{}}
		return this.lastLevel1 = ul.lis[name] = {el:funAddHtmlE(ul.el,"li",name,"",o,event_func)}
    };
    add_li(name,options,event_func){
		let o = options||{}
        let li = {el:funAddHtmlE(this.ul,"li",name,"",o,event_func),ul:null}
			li.ul = {el:funAddHtmlE(li.el,"ul","","",{class:"submenu"}),lis:{}}
		return this.lastLevel0 = this.lis[name] = li
		
    };
    constructor(id,container=document.querySelector("#visual_components")){
		this.div = 	funAddHtmlE(container,"div","",id,{class:"hidden"});
		this.ul =	funAddHtmlE(this.div,"ul",`
		  <li>Cockpit</li>
		  <li>
			1220438S01 0001
			<ul class="submenu">
			  <li title="test">Fertigungsversion</li>
			  <li title="test">92219 - SGM 69</li>
			  <li title="test">nicht Eingeplant / Wochenende / Auftragsende</li>
			  <li title="test"></li>
			  <li title="test"></li>
			  <li title="test">1 Ma fehlt</li>
			</ul>
		  </li>
		  <li>
			FM Links
			<ul class="submenu">
			  <li>Unterkategorie A</li>
			  <li>Unterkategorie B</li>
			</ul>
		  </li>
		  <li>
			SAP Links
			<ul class="submenu">
			  <li>Unterkategorie A</li>
			  <li>Unterkategorie B</li>
			</ul>
		  </li>
		  <li>
			CDB Links
			<ul class="submenu">
			  <li>Unterkategorie A</li>
			  <li>Unterkategorie B</li>
			</ul>
		  </li>
		  <li>
			Datasphere
			<ul class="submenu">
			  <li>Unterkategorie A</li>
			  <li>Unterkategorie B</li>
			</ul>
		  </li>
		  <li>
			Accsess DB
			<ul class="submenu">
			  <li>Unterkategorie A</li>
			  <li>Unterkategorie B</li>
			</ul>
		  </li>
		</ul>`)
		return this
	}
	
}


//cM = new contextMene()
//cM.show()
function excelColorToHex (decimalColor){
    function decimalToRgb(decimal) {
        var r = decimal & 255;
        var g = (decimal >> 8) & 255;
        var b = (decimal >> 16) & 255;
        return { r: r, g: g, b: b };
    }
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
    //let decimalColor = 49407;
    let rgbColor = decimalToRgb(decimalColor);
    let hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    return hexColor
}


funChangeFetch=function() {
  // Original fetch-Methode sichern
  const originalFetch = window.fetch;

  // Fetch-Methode überschreiben
  window.fetch = async (...args) => {
    const [resource, config] = args;

    // Erfasse den Payload des Requests
    const requestPayload = config?.body;

    try {
      // Führe den Original-Fetch-Request aus
      const response = await originalFetch(...args);

      // Klone die Antwort, da sie nur einmal lesbar ist
      const responseClone = response.clone();

      // Lies den Text/JSON der Antwort aus
      const responseData = await responseClone.json();

      // Debugging: Gib Request und Response aus
      //console.log("Request URL:", resource);
      //console.log("Request Payload:", requestPayload);
      //console.log("Response Data:", responseData);
    response.requestPayload = requestPayload;
      return response; // Original-Response zurückgeben
    } catch (error) {
      console.error("Fetch-Error:", error);
      throw error; // Fehler erneut werfen
    }
  };
};



funAddFilter=function(place,tableplace,object){
	ob = object||obj||globalThis.obj
    let c = place||document.querySelector('#dfilter');
    c.innerHTML='Filter: ';
	if(ob.data==undefined) return c.innerHTML=""
	if(ob.data!=undefined) if(ob.data[0]==undefined) return c.innerHTML=""
    var filterfield = funAddHtmlE(c,'select',null,"filterfield",{title:". - any single caracter&#10;^ - starts with&#10;^$ - null&#10;^(?!.*aa).+$ - exclude aa"})
    Object.keys(ob.data[0]).forEach(n=>{
        funAddHtmlE(filterfield,"option",n,null,{value:n})
    })
    filtervalue=funAddHtmlE(c,"input",null,'filtervalue',{type:'search'},{input:(ev)=>{
		dcont = tableplace||document.querySelector("div#dcontent");
		dcont.innerHTML = '';
		let arr = ob.data.filter(arr=>{
			let v=arr[filterfield.value];
			if(v!=null){return v.toString().toLowerCase().match(filtervalue.value.toLowerCase())}else{return v}
		})
		for(n in ob.data){if(n.match(new RegExp("^[^0-9]"))!=null) arr[n]=ob.data[n]}
		funAddTableArrObj(dcont,arr,ob.keycol)                                                                   
		}
	})
}





formular = {
	standard:function(arr, name = 'export', type, extension, headerText) {
		let destroyModal = function () {
			const overlay = document.getElementById('overlay');
			const modal = document.getElementById('modal');
			if (overlay) overlay.remove();
			if (modal) modal.remove();
		}
		
		if (!document.getElementById('modal')) {
        const overlay = this.overlay(destroyModal)
		
		overlay.addEventListener("click",destroyModal)
		
		let n = name;
		//let headerText = '';
		let contentcontainer;
		// Modal und Overlay erstellen, wenn kein Typ angegeben ist
		if (!type) {
			/* if (!document.getElementById('modal')) {
				const overlay = document.createElement('div');
				overlay.id = 'overlay';
				overlay.style.position = 'fixed';
				overlay.style.top = '0';
				overlay.style.left = '0';
				overlay.style.width = '100%';
				overlay.style.height = '100%';
				overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
				overlay.style.zIndex = '999';
				overlay.style.display = 'block';
				document.body.appendChild(overlay); */

				const modal = document.createElement('div');
				modal.id = 'modal';
				modal.style.position = 'fixed';
				modal.style.top = '50%';
				modal.style.left = '50%';
				modal.style.transform = 'translate(-50%, -50%)';
				modal.style.backgroundColor = 'white';
				modal.style.padding = '20px';
				modal.style.borderRadius = '8px';
				modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
				modal.style.textAlign = 'left';
				modal.style.zIndex = '1000';
				modal.style.display = 'block';
				modal.style.maxHeight = (window.innerHeight-200)+'px';
				modal.style.maxWidth = (window.innerWidth-200)+'px';
				modal.style.width = '100%';

				// Schließen-Button hinzufügen
				const closeButton = document.createElement('button');
				closeButton.innerHTML = '&times;';
				closeButton.style.position = 'absolute';
				closeButton.style.top = '10px';
				closeButton.style.right = '10px';
				closeButton.style.border = 'none';
				closeButton.style.background = 'none';
				closeButton.style.fontSize = '20px';
				closeButton.style.cursor = 'pointer';
				closeButton.onclick = destroyModal;
				modal.appendChild(closeButton);



				const buttonContainer = document.createElement('div');
				buttonContainer.style.textAlign = 'center';
				buttonContainer.style.marginTop = '20px';

				const createButton = (text, onClick) => {
					const button = document.createElement('button');
					button.innerText = text;
					button.style.margin = '5px';
					button.style.padding = '10px 20px';
					button.style.fontSize = '16px';
					button.style.cursor = 'pointer';
					button.onclick = onClick;
					return button;
				};

				contentcontainer = document.createElement('div');
					contentcontainer.style.maxHeight = (window.innerHeight-300)+'px';
					contentcontainer.style.maxWidth = (window.innerWidth-210)+'px';
					contentcontainer.style.width = '100%';
					contentcontainer.style.overflow = 'scroll';
					modal.appendChild(contentcontainer);
				//buttonContainer.appendChild(createButton('Als JSON speichern', () => saveFile('json')));
				//buttonContainer.appendChild(createButton('Als CSV speichern', () => saveFile('csv')));
				//contentcontainer = funAddHtmlE(modal,"div","","",{style:`overflow:scroll;max-height:${window.innerHeight-200}px;max-width:${window.innerWidth-200}px;`})
				
				//console.log(contentcontainer)
				
				modal.appendChild(buttonContainer);
				document.body.appendChild(modal);
				if(arr) funAddTableArrObj(contentcontainer,arr,"","")
			} else {
				document.getElementById('overlay').style.display = 'block';
				document.getElementById('modal').style.display = 'block';
			}
			return contentcontainer;
		}

		destroyModal();
	},
	overlay:function(destroyer){
		overO = {
			id:'overlay',
            style:"position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);z-index: 999;display: block;"
        };
		const overlay = document.getElementById('overlay')||funAddHtmlE(document.body,"div","overlay",{click:()=>console.log('ja')},overO);
		const destroyfun = function (){
			overlay.remove()
			destroyer = destroyer ||function(){}
		};
		return overlay
	},
	assets:function(data,assetType,formularOptions) {
	let destroyModal = function () {
        const overlay = document.getElementById('overlay');
        const modal = document.getElementById('modal');
        if (overlay) overlay.remove();
        if (modal) modal.remove();
    }

    //let n = name;
    //let headerText = '';

    // Modal und Overlay erstellen, wenn kein Typ angegeben ist
    if (!document.getElementById('modal')) {
        const overlay = this.overlay()
	


//https://mutares.eu10.hcs.cloud.sap/api/v1/dwc/consumption/
//analytical/MT_APP_PROD_OUTPUT/MT_POUT_RL_DAILY_SCRAP_V2/MT_POUT_RL_DAILY_SCRAP_V2?
//&$select=WERKS,D_PLANT_MATERIAL_PRODAREA,GQTY,SVAL,GVAL,RUECKMELD
//&$filter=WERKS%20eq%20%270067%27%20and%20BUDAT%20ge%202025-02-04%20and%20BUDAT%20le%202025-02-04	
		
		formO = {
			id:'modal',
			style:'position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: white;padding: 20px;border-radius: 8px;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;text-align: left;z-index: 1000;display: block;max-width: 700px;width: 100%;'
		}	
            const modal = document.createElement('div');
            modal.id = 'modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = 'white';
            modal.style.padding = '20px';
            modal.style.borderRadius = '8px';
            modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            modal.style.textAlign = 'left';
            modal.style.zIndex = '1000';
            modal.style.display = 'block';
            modal.style.maxWidth = '700px';
            modal.style.width = '100%';
			
			
			// Schließen-Button hinzufügen
			const closeButton = document.createElement('button');
			closeButton.innerHTML = '&times;';
			closeButton.style.position = 'absolute';
			closeButton.style.top = '10px';
			closeButton.style.right = '10px';
			closeButton.style.border = 'none';
			closeButton.style.background = 'none';
			closeButton.style.fontSize = '20px';
			closeButton.style.cursor = 'pointer';
			closeButton.onclick = destroyModal;
			modal.appendChild(closeButton);

            console.log(data)
            
            const createInput = (name,options={}) => {
                inpO = {
                    id:name,
                    tag:"input",
                    style:"",
                    oninput:"localStorage.setItem('last'+this.id,this.value)"
                }
                for(n in options){
                    inpO[n] = options[n]
                }
				console.log(data.columns.columns[name])
				if(data.columns.columns) if(data.columns.columns[name]) if(data.columns.columns[name].columnProperty.Type.match("int")) options.type = "number"
                let {tag,id, ...rest} = inpO;
                div = funAddHtmlE(modal,"fieldset");
                funAddHtmlE(div,"legend",name);
                let fld = funAddHtmlE(div,tag,"",id,rest)
                fld.value = localStorage.getItem("last"+id)
            }


            data.columns.inputs.forEach(el=>createInput(el))

            arr = ["filter_str","select_str","order_str"]
                arr.forEach(el=>{
                createInput(el,{style:"width:100%",id:data.key+el})
            })
            
        
            createInput("skip")
            createInput("top")
        
            let cols = data.columns.columnArr
            let divColumns = funAddHtmlE(modal,"fieldset","","",{style:"padding: unset;display: flow;max-height: 300px;overflow: scroll;"});
                funAddHtmlE(divColumns,"legend","Fields");
            cols.forEach(el=>{
                let {name, ...rest} = el
                funAddHtmlE(divColumns,"div",name,name,{title:JSON.stringify(rest),class:"infofield",style:"user-select: all;"});
                
            })

            
            
         
            //const headerDiv = createInput('Text am Dateianfang:', 'headerText');
            

            const buttonContainer = document.createElement('div');
            buttonContainer.style.textAlign = 'center';
            buttonContainer.style.marginTop = '20px';

            const createButton = (text, onClick) => {
                const button = document.createElement('button');
                button.innerText = text;
                button.style.margin = '5px';
                button.style.padding = '10px 20px';
                button.style.fontSize = '16px';
                button.style.cursor = 'pointer';
                button.onclick = onClick;
                return button;
            };

            const showResult = (type) => {
                let str = data['asset'+assetType+'DataUrl'] + data.name
                let inp = data.columns.inputs
                if(inp.length > 0) {
                    str+="("
                    inp.forEach(el=>{
                        str+=el+"="+modal.querySelector("input#"+el).value+","
                    });
                    str = str.slice(0,str.length-1)
                    str+=")/Set"
                }
                str+="?"
				let next = false
                a = [["filter_str","$filter=","contains(LTXA1, 'beinhaltet')"],["select_str","$select="],["order_str","$orderby="]].forEach(el=>{
                    let e = modal.querySelector("input#"+(funCleanMatcher(data.key))+el[0])
                    if(!(e)) return;
						e.title=el[2]
                        let v = e.value
						//if(!v || v=='') return;
						if(next) str+="&"
                        if(v=="") return
                        str+=el[1]+v
						next = true
                })
				a = [["skip","$skip="],["top","$top="]].forEach(el=>{
                    let e = modal.querySelector("input#"+el[0])
                    if(!(e)) return;
                        let v = e.value
						//if(!v || v=='') return;
						if(next) str+="&"
                        if(v=="") return
                        str+=el[1]+v
						next = true
                })
				
				switch(type){
					case "browser":
						console.log(str)
						window.open(str,"_blank")
						break;
					case "console":
						const start = new Date()
						fetch(str).then(data=>data.json()).then(data=>console.log(funDatum.getDuration(new Date()-start),data.value)).catch(error => console.error('Error:', error));
						break;
					default:
						console.log(str.slice(8))
						console.log(str.split("/"))
						//console.log("nich angelegt")
				}
						
                
                
            };

            buttonContainer.appendChild(createButton('Build URL', () => showResult()));
            buttonContainer.appendChild(createButton('console', () => showResult("console")));
            buttonContainer.appendChild(createButton('Browser', () => showResult("browser")));

            modal.appendChild(buttonContainer);

            document.body.appendChild(modal);
        return;
    }

    destroyModal();

}
}






datasphereAssets = {
	assets:{
		"MT_APP_CORP_PUBLIC/MT_PUBL_RL_DAILY_SCRAP":{},
	},
	assetInfos:{},
	addAssets:function(arr){
		arr.forEach(el=>{
			this.assets[el._key]=this.assets[el._key]||{}
			this.assets[el._key].key = el._key
			for(n in el){
				this.assets[el._key][n] = el[n]
			}
		})
		return this.assets		
	},
	columnTypes:{
		label:{style:"background:bisque;"},
		WERKS:{style:"background:lightgrey;"},
	},
	data:{},
	flow_asset:function(element,type){
		let id = (element.getAttribute('_key')==null)?element.parentElement.getAttribute('_key'):element.getAttribute('_key')
		this.id=id
		if(id==null) return
		this.type=type
		this.getInfo(id,type)
	},
	flow_spaces:function(id,type){
		this.id=id
		this.type=type
		let link = "https://mutares.eu10.hcs.cloud.sap/dwaas-core/odata/v4/catalog/spaces('"+this.assets[id].name+"')/assets?"
		if(electron) {
			ipc.send("request",{request: ['dlink','get_data',link]})
		}else{
			window.location = link
		}			
		//this.getInfo(id,type)
	},
	getAllInfos:function(assetType='Analytical'){
		for(n in this.assets){
			const ass = this.assets[n]
			get_info_dlink_prom(ass['asset'+assetType+'MetadataUrl']).then(data=>{
				ass.columns = data
			}).catch(err)
		}
	},
	getInfo:function(id,assetType='Relational'){
		formular.overlay()
		const ass = this.assets[id]
		console.log(ass)
		const ty = assetType
		get_info_dlink_prom(ass['asset'+ty+'MetadataUrl']).then(data=>{
			ass.columns = data
			ass._columnTypes = data
			formular.assets(ass,ty)
			console.log(d)
		})
	},
	flow_click:function(element){
		if(element) return
	},
	init_spaces:async function(container){
		const cont = container
		fetch("https://mutares.eu10.hcs.cloud.sap/dwaas-core/odata/v4/catalog/assets?").then(d=>d.json()).then(dat=>{
			dat.value.forEach(el=>{
				obj.data.forEach(e=>{
					e.qty = e.qty || 0
					if(e.name == el.spaceName) e.qty++
				})
			})
			cont.innerHTML = ''
			funAddTableArrObj(cont,obj.data)
		});
		
		
		this.assets = this.addAssets(obj.data)
		console.log(this.assets)
        newO = []
		obj.data.forEach(el=>{
			let key=el.name
			analytical = (el.supportsAnalyticalQueries)?"analytical":null
			newO.push({name:el.name,_key:key,assets:'assets',label:el.label})
			this.assets[key] = this.assets[key] || {}
			for(n in el){
				this.assets[key][n]=el[n]
			}
		})
		obj.data = newO
		obj.data._columnTypesForTable = {
			assets:{type:"button",onclick:"datasphereAssets.flow_spaces(this.parentElement.parentElement.getAttribute('_key'))"},
			
		}
		this.table = await funAddTableArrObj(container,newO)
		/*this.table.children[1].childNodes.forEach(el=>{
			let cont = el.querySelector("#label")
			let key = el.querySelector('#key').innerHTML
			funAddHtmlE(cont,"button","test",key,{key:key,onclick:"datasphereAssets.flow_asset(this.id)"},null,true)
		}) */
		//this.getAllInfos()
		datasphereAssets.assets = {...this.assets}
	},
	init_assets:async function(container){
		obj=obj||globalThis.obj
		if(obj.data.length == 0) return funAddHtmlE(container,"div","nothing going on here yet")
		console.log('assets',obj)
		
		newO = []
		obj.data.forEach(el=>{
			el.key=el.spaceName+"/"+el.name
			el._key=el.key
			analytical = (el.supportsAnalyticalQueries)?"analytical":null
			newO.push({
				name:el.name,
				spaceName:el.spaceName,
				_key:el.key,
				relational:'relational',
				analytical:analytical,
				label:el.label,
				Datasphere:"Link",
				})
			
			
			/* this.assets[key] = this.assets[key] || {}
			//console.log(datasphereAssets.assets)
			for(n in el){
				this.assets[key][n]=el[n]
			} */
		})
		this.addAssets(obj.data)
		obj.data = newO
		
		obj.data._columnTypesForTable = {
			//label:{type:"button",onclick:"datasphereAssets.flow_asset(this.parentElement.parentElement.getAttribute('_key'))"},
			analytical:{type:"button",onclick:"datasphereAssets.flow_asset(this.parentElement.parentElement,'Analytical')"},
			relational:{type:"button",onclick:"datasphereAssets.flow_asset(this.parentElement.parentElement,'Relational')"},
			Datasphere:{type:"button",onclick:`window.open("https://mutares.eu10.hcs.cloud.sap/dwaas-core/index.html#/databuilder&/db/"+this.parentElement.parentElement.getAttribute("_key"))`},
		}
		this.table = await funAddTableArrObj(container,newO)
		/*this.table.children[1].childNodes.forEach(el=>{
			let cont = el.querySelector("#label")
			let key = el.querySelector('#key').innerHTML
			funAddHtmlE(cont,"button","test",key,{key:key,onclick:"datasphereAssets.flow(this.id)"},null,true)
		}) */
		//this.getAllInfos()
		datasphereAssets.assets = {...this.assets}
	}
}


var Dataset
Dataset = Dataset || class Dataset {
	counters={};
	request={source:"init"};
	get_type = function(){
		let get_params_from_payload=function(payload){
			let req = {}
			try{
				payload.split("&").forEach(el=>{
					let e = el.split("=");
					req[e[0]]=(typeof(e[1])=='string')?e[1].toString().replaceAll('%20'," ").replaceAll("%3A",":").replaceAll("%27","'"):e[1]
				})
			}catch(err){return err}
			return req
		};
		if(this.data) if(this.data._request!=undefined) {
			let sto = this.request
			sto.source = "init"
			sto.origin=	this.data._request
			//console.log(sto)
			switch(true){
				case (this.data._request.match("CLIENT_INFO_ARRAY=")!=null || this.data._request.match("factoryminer.com") || this.data._request.match("fmdb")):
					sto.parameters= get_params_from_payload(this.data._request)
					sto.report= sto.parameters.FRAME
					sto.source=	"factoryminer";
					//console.log('this.data.request.match("CLIENT_INFO_ARRAY=")!=null)')
					break;
				case (this.data._request.match("dispp")!=null):
					//sto.report= sto.parameters.FRAME
					sto.source=	"dispp";
					//console.log('dispp')
					break;
				case (this.data._request.match("eu10")!=null):
					//sto.report= sto.parameters.FRAME
					sto.source=	"dataspherereports";
					//console.log('dispp')
					break;
				default:
					console.log("Dataset - get_type - no request case - ",this.data._request)
			}
			if(this.data._request.match("CLIENT_INFO_ARRAY=")!=null) {
				
				
				
				
			}
		}
		delete this.get_type 
	}
	add_configuration = function(conf){
		if(conf) this.keys.forEach(k=>{
			if(conf[k]) this.data._columnTypesForTable[k] = conf[k]
		})
	};
	add_configuration_match = function(conf){
		if(!(this.data._request)) return console.log("Dataset - keine _request-Quelle")
		if(conf!=undefined) this.keys.forEach(k=>{
			if(conf[k]) Object.keys(conf[k]).forEach(m=>{
				//console.log(k,m,this.data.request)
				if(this.data._request.match(m)!=null) this.data._columnTypesForTable[k] = conf[k][m]
			})
		})
	};
	pre_pare=async function (){
        let rowFunctions = {
            "init":function(el){
                
            },
			"dataspherereports":function(el){
                
            },
			"dispp":function(el){
				let group = function(el,groupName,namesAsArr){
                    
                    el[groupName]=el[groupName]||{}
            		namesAsArr.forEach(name=>{
                        if(typeof(el[name])=='undefined') return
                        if(name==groupName) return
            			el[groupName][name] = el[name]
            			delete el[name]
            		})
            	};
				//console.log(this)
                if(el.Farbe){ 
					el._color=excelColorToHex(el.Farbe);delete el.Farbe;
					if(el.Bemerkung) el.Bemerkung=`<div style="background:${el._color}">${el.Bemerkung}</div>`;
				}
				group(el,"Zusatzdaten",["Zeile","Aktiv","Sichtbar","Wochentag","Plandatum","Plan","Anlage","eqFaktor"])
				
            },
            "factoryminer":function(el){
                let parse = function(data){
            		try{
            			return JSON.parse(data)
            		}catch(err){console.log(err)}
            	};
            	let group = function(el,groupName,namesAsArr){
                    
                    el[groupName]=el[groupName]||{}
            		namesAsArr.forEach(name=>{
                        if(typeof(el[name])=='undefined') return
                        if(name==groupName) return
            			el[groupName][name] = el[name]
            			delete el[name]
            		})
            	};
                if(el.color && el.machinestatusname){
					el._machinestatusname = el.machinestatusname
					el.machinestatusname=`<div style="background:${el.color}">${el.machinestatusname}</div>`;
					el._color=el.color;delete el.color;
				}
				if(el.color && el.machinestatus){
					el._machinestatus = el.machinestatus					
					el.machinestatus=`<div style="background:${el.color}">${el.machinestatus}</div>`;
					el._color=el.color;delete el.color;
				}
				if(el.machinestatus_color && el.machinestatus_name){
					el._machinestatus_name = el.machinestatus_name
					el.machinestatus_name=`<div style="background:${el.machinestatus_color}">${el.machinestatus_name}</div>`;
					el._color=el.machinestatus_color;delete el.machinestatus_color;
				}
					
                if(el.order_customized_data!=undefined) el.order_customized_data = parse(el.order_customized_data);
        		if(el.oowa_customized_data) el.oowa_customized_data = parse(el.oowa_customized_data);
                let arrGroup = [
					"order_customized_data",
        			"oowa_customized_data",
        			"oowa_customized_data",
        			"color",
					"machinestatustype_id",
        			"machinepartname",
        			"customername",
        			"parent_order_description",
        			"batchname",
        			"tool_name",
        			"workingstep_sequence_number",
        			"workingstep_unit_name",
        			"quantity",
        			"unitsgood",
        			"unitsscrap",
        			"unitsgross",
        			"unitsremaining",
        			"tacts_since_shift_begin",
        			"shiftteamname",
        			"speed",
        			"order_finish_estimated",
        			"speed_percent",
        			"current_speed",
        			"order_finish_estimated_by_current_speed",
        			"current_speed_percent",
        			"machinegroup",
        			"rowcount",
					"machinepart_name",
					"workers",
					"resource_article_number",
					"resource_name",
					"resource_amount",
					"batch_name",
					"customer_name",
					"shiftteam_name",
					"units_gross",
					"machinepart_name",
					"machinetype_name",
					"prod_status_remarks_extended",
					"prod_status_remarks_simple",
					"prod_order_remarks_simple",
					"prod_order_remarks_extended",
					"shift_begin",
					"shift_end",
										
        			]
                
                Object.keys(el).forEach(n=>{
                    if(n.match("run")!=null) arrGroup.push(n)
                })
                group(el,"fm-data",arrGroup)
            }
        }
		let group = function(el,groupName,namesAsArr){			
			el[groupName]=el[groupName]||{}
			namesAsArr.forEach(name=>{
				if(typeof(el[name])=='undefined') return
				if(name==groupName) return
				el[groupName][name] = el[name]
				delete el[name]
			})
		};
		
		let srcname;
		
        //this.add_configuration({name:{type:"button",propertis:["_color"]}})
        if(typeof(columnconfig)=='undefined'){ 
			console.log("keine columnconfig")
		}else{
			srcname='factoryminer';if(typeof(window.columnconfig[srcname])!='undefined') if((typeof(window.columnconfig[srcname])!='undefined')) this.add_configuration_match(window.columnconfig[srcname])
            
			//this.add_configuration_match(columnconfig)
		}
		let src = this.request.source||null
		//console.log("src",src)	
		//if((typeof(dataspherereports.columnconfig)!='undefined')) this.add_configuration_match(dataspherereports.columnconfig)
		//if(typeof(dispp)!='undefined') if((typeof(dispp.columnconfig)!='undefined')) this.add_configuration_match(dispp.columnconfig)
			srcname='dispp';if(typeof(window[srcname])!='undefined') if((typeof(window[srcname].columnconfig)!='undefined')) this.add_configuration_match(window[srcname].columnconfig)
			srcname='dataspherereports';if(typeof(window[srcname])!='undefined') if((typeof(window[srcname].columnconfig)!='undefined')) this.add_configuration_match(window[srcname].columnconfig)
            
		//if(typeof(columnconfig)!='undefined') this.add_configuration(columnconfig)
        const source = this.request.source
		const rowFunction=rowFunctions[source]||function(){console.log(source," hat keine rowFunction")}
		
        //console.log(rowFunction)
		let groupArrays = {}
		let reqOri = this.request.origin
        if(reqOri!=undefined && reqOri!=null) if(typeof(dataspherereports)!='undefined' && src=='dataspherereports') {
			let conf = dataspherereports
			if(typeof(conf.groupArrays)!='undefined'){
				for(const matcher in conf.groupArrays){
					if(reqOri.match(matcher)!=null) for(const grp in conf.groupArrays[matcher]){groupArrays[grp]=(groupArrays[grp]||[]).concat(conf.groupArrays[matcher][grp]);}
				}
				
			}
		}
		//console.log(groupArrays)
		
        //console.log(this.request)
		if(this.data.length>0) this.data.forEach(el=>{
			for(const grp in groupArrays){group(el,grp,groupArrays[grp])}
			//rowFunctionStandard(el)
            rowFunction(el)
			if(this._calculationFunctions) this._calculationFunctions.forEach(dfr=>{
				let funct = (d,e)=>{
					try{eval(dfr[1])}catch(err){"_calculationFunctions",console.log(err)}
				}
				funct(this.data,el)
			})
        })

	};
	get_table_data=async function(){
		await this.pre_pare()
        return this.data
	};
	__get_feValue=function(dataCell){
		let v = dataCell
		if (typeof(v)=='boolean' || v == 'true' || v == 'false') {
			v = v.toString()
		}else if(typeof(v)=='number'){
			v=funGerNumb(v,2);
		}else if(typeof(v)=='string'){
			if(new Date(v)!="Invalid Date" && v.length ==24 && v.charAt(10)=='T' && v.charAt(23)=='Z'){
				v=new Date(v)
				v=(v.getHours()+v.getMinutes()+v.getSeconds() == 0)?v.toLocaleDateString():v.toLocaleString()
			}else if((v.match(/^-?\d*\.\d*$/))){
				v = (v*1)
				v = funGerNumb(v,2);
			}else{}
		}else if(new Date(v)!='Invalid Date' && v!=null){
			v = new Date(v)
			v=(v.getHours()+v.getMinutes()+v.getSeconds() == 0)?v.toLocaleDateString():v.toLocaleString()
		}else{} 
		return v
	};
	
	constructor(object){
		this.object = object;
		let data = object.data||object.value||object||[{}];
		this.data = data
		Object.keys(data).forEach(k=>{this.data[k]=data[k]})
		data._request=data._request||data.request||JSON.stringify(object.request)||"init"
		if(typeof(data.request)=='object') data.request = (data.request).toString() 
        data._class = "Dataset";
		data._get={
			feValue:this.__get_feValue
		}
		this.get_type()
		this._calculationFunctions = this.data._calculationFunctions||[]
		data._columnTypesForTable=data._columnTypesForTable||{}
		let keys = [];
		if(Array.isArray(data)) {
			if(data[0]!=undefined) keys = Object.keys(data[0])
		}else{ 
			Object.keys(data)
		}
			
		this.keys = keys
        this.pre_pare = this.pre_pare.bind(this);
		this.pre_pare();
		
		if(Array.isArray(data)) {
			if(data[0]!=undefined) keys = Object.keys(data[0])
		}else{ 
			Object.keys(data)
		}
		//console.log(keys)
		data._keyColumn = (keys.indexOf(object._keyColumn) != -1)?object._keyColumn:keys[0]
        return this
	}
}

Valuefield = class{
	value=null;
	name=null;
	source=null;
	columnTypes={};
	get_feValue=function(){
		let v = this.value
		if (typeof(v)=='boolean' || v == 'true' || v == 'false') {
			v = v.toString()
		}else if(typeof(v)=='number'){
			v=funGerNumb(v,2);
		}else if(typeof(v)=='string'){
			if(new Date(v)!="Invalid Date" && v.length ==24 && v.charAt(10)=='T' && v.charAt(23)=='Z'){
				v=new Date(v)
				v=(v.getHours()+v.getMinutes()+v.getSeconds() == 0)?v.toLocaleDateString():v.toLocaleString()
			}else if((v.match(/^-?\d*\.\d*$/))){
				v = (v*1)
				v = funGerNumb(v,2);
			}else{}
		}else if(new Date(v)!='Invalid Date' && v!=null){
			v = new Date(v)
			v=(v.getHours()+v.getMinutes()+v.getSeconds() == 0)?v.toLocaleDateString():v.toLocaleString()
		}else{} 
		return v
	};
	get_ValueField = function(field,src){
		let v =this.value
		let n = this.name;
		let tdata = field//document.createElement('td');
		let htmlObject = {
			type:"div",
			title:n+"\n"+v,
			id:n,
			value:v
		}
		cty = this.columnTypes[n]||{}
		for(p in cty){
			htmlObject[p] = cty[p]
		}
		if(htmlObject.valueMatcher!=undefined){ 
			Object.keys(htmlObject.valueMatcher).forEach(m=>{
				if(m=='undefined') return
				if(v.match(m)!=null) Object.keys(htmlObject.valueMatcher[m]).forEach(p=>{
					htmlObject[p] = htmlObject.valueMatcher[m][p]})
				})
			delete htmlObject.valueMatcher
		}
		if(htmlObject.stringMatcher!=undefined){ 
			Object.keys(htmlObject.stringMatcher).forEach(m=>{
				if(m=='undefined') return
				if(v.match(m)!=null) Object.keys(htmlObject.stringMatcher[m]).forEach(p=>{
					htmlObject[p] = htmlObject.stringMatcher[m][p]})
				})
			delete htmlObject.stringMatcher
		}
		if (typeof(v)=='boolean' || v == 'true' || v == 'false') {
		}else if(typeof(v)=='number'){
		}else if(typeof(v)=='string'){
			if(v.startsWith("<")){
				tdata.title = ''
				delete htmlObject.title
			}
		}else if(new Date(v)!='Invalid Date' && v!=null){
		}else{} 
		if(typeof(v)=='object' && v!=null){
			//console.log("object",tdata)
			let tit = "object"//n+"\n"+JSON.stringify(v);
			const cklElem = funAddHtmlE(tdata,"div",'&#9776;',n,{title:tit,onclick:'funChangeDisplayObject(this.parentElement.querySelector("div#hide"))'})
			let sc = funAddHtmlE(tdata,"div",'','hide',{style:'display:none;'})
			if(src=='obj') {
				funAddTableArrObj(sc,v,null,null,1)
			}else{
				const functionone = ()=>{funAddTableArrObj(sc,v,null,null,1)}
				cklElem.addEventListener("click",functionone, { once: true })
			}
		}else{
			
		
		//if(htmlObject){
			const {type, ...rest } = htmlObject
			funAddHtmlE(tdata,type,this.get_feValue(),"",rest)
		}
		return tdata
	};
	constructor(data,columName,source){
		this.value = data
		this.name = columName
		this.source = source
		return this
	}
}


oAcolConf = {
	get_name:function(colName,{langKey}={langKey:langKEY||0}){
		lang = langKey || langKEY || 0
		ind = ['DE','EN'].indexOf(lang)
		if(!!ind) return colName
		if(!(this._names[colName])) return colName
		return this._names[colName][ind] || colName
	},
	get_htmlProp:function(colName,value){
		return {}
	},
	name:{
		
	},
	oee_percent_since_shift_begin:{
	},
	_names:{
		name:['ID'],
		machine_description:['Maschine'],
		status_begin:['Status seit'],
		oee_percent_since_shift_begin:['OEE'],
		machinestatusname:["Status"],
		"performance_factor_since_shift_begin":["Geschw"],
		"quality_factor_since_shift_begin":['Quali'],
		"availability_factor_since_shift_begin":["Verfü"],
		product_name:["Material"],
		product_group_name:["Produktgruppe"],
		parent_order_name:['Projekt','Project'],
		units_per_hour:["Stk/h"],
		units_good_since_shift_begin:["Gutteile"],
		units_scrap_since_shift_begin:["Ausschuss"],
		"order_customized_data":[],
		"oowa_customized_data":[],
		"oowa_customized_data":[],
		"color":[],
		"machinestatustype_id":[],
		"machinepartname":[],
		"customername":[],
		"parent_order_description":[],
		"batchname":[],
		"tool_name":[],
		"workingstep_sequence_number":[],
		"workingstep_unit_name":[],
		"quantity":[],
		"unitsgood":[],
		"unitsscrap":[],
		"unitsgross":[],
		"unitsremaining":[],
		"tacts_since_shift_begin":[],
		"shiftteamname":[],
		"speed":[],
		"order_finish_estimated":[],
		"speed_percent":[],
		"current_speed":[],
		"order_finish_estimated_by_current_speed":[],
		"current_speed_percent":[],
		"machinegroup":[],
		"rowcount":[],
		"machinepart_name":[],
		"workers":[],
		"resource_article_number":[],
		"resource_name":[],
		"resource_amount":[],
		"batch_name":[],
		"customer_name":[],
		"shiftteam_name":[],
		"units_gross":[],
		"machinepart_name":[],
		"machinetype_name":[],
		"prod_status_remarks_extended":[],
		"prod_status_remarks_simple":[],
		"prod_order_remarks_simple":[],
		"prod_order_remarks_extended":[],
		"shift_begin":[],
		"shift_end":[],
	}
}


try{
	var module = module || {exports:function(){}}
	module.exports = { 
		funAddTableArrObj, 
		funAddHtmlE, 
		get_info_dlink,
		get_info_dlink_prom,
		funAddFilter,
		funTabelHeaderNames,
		findProperty,
		};
}catch(err){}


funAlert = function(meldung="",titel=""){
    if (Notification.permission === "granted") {
      new Notification(titel, {
        body:meldung,
        icon: "https://example.com/icon.png" // optional
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(titel, {
            body: meldung,
          });
        }
      });
    }
}

