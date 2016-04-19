function ajax(req,url,data,cb) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(cb)cb(xhttp.response);
		}
	};
	data = data?'?'+data:'';
	if(req == "GET"){
		xhttp.open("GET", url+data, true);
		xhttp.send();
	}else{
		xhttp.open("POST", url, true);
		xhttp.send(data);
	}
}

function colorPicker(num) {
	return colors[parseInt(Math.random() * 5)];
}

function reactHTML(str) {
	return {
		__html: str
	};
}
function msgbox(str){
	var msg1 = document.getElementById('msgbox');
	msg1.innerHTML=str;
	setTimeout(function(){msg1.innerHTML = '';},2000);
}
var rt = React.createClass({
	getInitialState: function() {
		var obj = [];
		obj = this.props.data ? this.props.data : obj;
		return {
			data: obj
		};
	},
	data: function(obj) {
		obj = obj == null || obj == "" ? [] : obj;
		this.setState({
			data: obj
		});
	},
	loadPage: function(){
		var _this = this;
		var cb = function(data){_this.data(JSON.parse(data||'{}'));}
		ajax('GET','/load',null,cb);
	},
	render: function() {
		var wrapper = null;		
		if(this.state.data.length>0){
			wrapper = React.createElement('div',{},
				this.state.data.map(function(e){
					return React.createElement(Employee,{data:e});
				})
			);
		}else wrapper = React.createElement('div',{dangerouslySetInnerHTML: reactHTML("No data available")});
		return React.createElement('div', {
			style: {
				border: '1px solid',
				textAlign: 'center'
			}
		}, React.createElement('div', {
				className:'greetings'
			},greetings,
			React.createElement('div',{
				className:'button',
				dangerouslySetInnerHTML: reactHTML("Add Employee"),
				onClick: function(){popup.add();}
			})
		),wrapper);
	}
});
var Employee = React.createClass({
	getInitialState: function() {
		return {data:this.props.data};
	},
	set: function(obj){
		this.setState({data:obj});
	},
	get: function(){
		return this.state.data;
	},
	details: function(){
		document.getElementById('detail').style.display='';
		popup.state.o=true;
		return popup.set(this.get());
	},
	render: function() {
		var data = this.state.data || {
			id: "",
			fname: "",
			lname:"",
			phn:"",
			email:'',
			dept: ""
		};
		var _this = this;
		return React.createElement('div', {
			className:'empWrapper',
			style: {
				backgroundColor: colorPicker(1)
			},
			onClick: function(){_this.details();}
		}, React.createElement('div', {
			dangerouslySetInnerHTML: reactHTML(data.id),
			dangerouslySetInnerHTML: reactHTML(data.id),
			className:'empId'
		}), React.createElement('div', {
			dangerouslySetInnerHTML: reactHTML(data.fname+' '+data.lname),
			className:'empName'
		}), React.createElement('div', {
			dangerouslySetInnerHTML: reactHTML(data.dept),
			className:'empDept'
		}));
	}
});
var EmpDetail = React.createClass({
	getInitialState: function() {
		var obj = {};
		obj = this.props.data ? this.props.data : obj;
		return {
			data: obj,
			o:false
		};
	},
	set: function(obj){
		this.setState({data:obj});
	},
	get: function(){
		return this.state.data;
	},
	del: function(){
		var b = confirm('Employee will be erased permanently. Proceed?');
		if(b){
			var cb = function(data){data=JSON.parse(data||'{}');msgbox(data.msg);setTimeout(function(){popup.close();},2000);}
			ajax('GET','/del','id='+this.get().id,cb);
		}
	},
	save: function(){
		var cb = function(data){data=JSON.parse(data||'{}');msgbox(data.msg);popup.state.o=true;popup.set(d);}
		var d = this.get();
		if(d.id==''||d.fname==''||d.lname==''||d.phn==''||d.email==''||d.dept==''){alert('All values must be entered');return;}
		if(/[^0-9]/.test(d.phn)){alert('Phone number must be digits only');return;}
		ajax('GET','/save','d='+JSON.stringify(d),cb);
	},
	add: function(){
		document.getElementById('detail').style.display='';
		popup.state.o=false;
		popup.set({});
	},
	close: function(){
		document.getElementById('detail').style.display='none';
		j.loadPage();
	},
	render: function() {
		var _this = this;
		var data = this.state.data||{};
		var wrapper = React.createElement('div',{style:{padding:'10px'}},
			React.createElement('button',{onClick:this.del,className:'delButton',style:{display:this.state.o?'':'none'}},'Delete'),
			React.createElement('label',{},'Username',React.createElement('input',{value:this.state.data.id,onChange:function(event){_this.state.data.id=event.target.value;_this.setState({data:_this.state.data});},disabled:this.state.o})),
			React.createElement('label',{},'FirstName',React.createElement('input',{value:this.state.data.fname,onChange:function(event){_this.state.data.fname=event.target.value;_this.setState({data:_this.state.data});}})),
			React.createElement('label',{},'LastName',React.createElement('input',{value:this.state.data.lname,onChange:function(event){_this.state.data.lname=event.target.value;_this.setState({data:_this.state.data});}})),
			React.createElement('label',{},'PhoneNumber',React.createElement('input',{value:this.state.data.phn,onChange:function(event){_this.state.data.phn=event.target.value;_this.setState({data:_this.state.data});}})),
			React.createElement('label',{},'Email',React.createElement('input',{value:this.state.data.email,onChange:function(event){_this.state.data.email=event.target.value;_this.setState({data:_this.state.data});}})),
			React.createElement('label',{},'Department',React.createElement('select',{value:this.state.data.dept,onChange:function(event){_this.state.data.dept=event.target.value;_this.setState({data:_this.state.data});}},
				options.map(function(d){return React.createElement('option',{key:d},d);})
			))
		);
		var close = React.createElement('button',{style:{float:'right'},onClick:_this.close},"Close");
		var buttons = React.createElement('div',{},
			React.createElement('button',{style:{},onClick:_this.save},"Save"),
			React.createElement('button',{style:{margin:'25px 0px 0px 80px'},onClick:_this.close},"Cancel")
		);
		return React.createElement('div', {
			className:'detailWrapper',
			style: {
				backgroundColor: this.props.clStr
			}
		}, React.createElement('div', {
			style: {
				padding: '5px',
				borderBottom: '2px solid gray',
				height:'38px'
			}},"Employee Details",close
		),wrapper,buttons,React.createElement('div',{id:'msgbox'}));
	}
});