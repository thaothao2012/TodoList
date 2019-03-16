import React, { Component } from 'react';
import './App.css';
import TaskForm from './components/Taskform';
import Control from './components/Control';
import TaskList from './components/TaskList';
import { findIndex,filter} from 'lodash';
class App extends Component {
    constructor(props){
        super(props);
        this.state  = {
            tasks : [], //id:unique(duy nhat),name,status
            isDispalyForm : false,
            taskEditing : null,
            filter : {
                name : '',
                status : -1
            },
            keyword : '',
            sortBy : 'name',
            sortValue : 1
        }
    }
    componentWillMount() // đây là hàm được gọi khi component đc gán vào hay nói cách khác là khi refresh lại trang
     {// hàm này chỉ đc gọi duy nhất 1 lần 
        // chúng ta sẽ sd hàm này để set lại state
        // trước tiên kiểm tra xem "localStorage" có tồn tại và lấy đc item "tasks" hay chưa
        if(localStorage && localStorage.getItem('tasks')){
            var tasks = JSON.parse(localStorage.getItem('tasks')); //parse sang object từ chuỗi 
            this.setState({
                tasks : tasks
            });
        } 


    }

     S4 = () => {
        return Math.floor((1+Math.random()) * 0X10000).toString(16).substring(1);
     }
     GenerateId = () => { 
        return this.S4() + this.S4() + this.S4() + '-' +this.S4() + this.S4() +'-' + this.S4() + this.S4();
     }
     onToggleForm = () =>{
        if (this.state.isDispalyForm && this.state.taskEditing !== null) {
            this.setState({ // set lai state
                isDispalyForm : true,
                taskEditing : null // taskEditing = null thi form cap nhat se đc đóng
            });
        }
        else {
            this.setState ({ // set lai state
                isDispalyForm : !this.state.isDispalyForm,
                taskEditing : null // taskEditing = null thi form cap nhat se đc đóng
            });
        }
        
            
     }
    onCloseForm = () => {
        this.setState ({ // set lai state
            isDispalyForm : false
        });
    }
    onShowForm = () => {
        this.setState ({ // set lai state
            isDispalyForm : true
        });
    }
    onSubmit = (data) => {
        var {tasks} = this.state;
        if (data.id === '') {
             data.id = this.GenerateId();
             tasks.push(data);
        }
        else
        {  //editing
            var index = this.findIndex(data.id);
            tasks[index] = data;
        }
       
        this.setState({
            tasks : tasks,
            taskEditing : null //clear taskEditing
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    onUpdateStatus = (id) => {
        var {tasks} = this.state;
        //var index = this.findIndex(id);
        var index = findIndex(tasks,(task) => {
                return task.id === id;
        });
        console.log(index);
        if (index !== -1) {
                tasks[index].status = !tasks[index].status;
                this.setState({
                        tasks : tasks
                });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    onDelete = (id) => {
        var {tasks} = this.state;
        var index = this.findIndex(id);
        console.log(index);
        if (index !== -1) {
            tasks.splice(index,1);
            this.setState({
                    tasks : tasks
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        this.onCloseForm();
    }
    onUpdate = (id) => {
        var {tasks} = this.state;
        var index = this.findIndex(id);
        var taskEditing =  tasks[index];
        this.setState({
                taskEditing :taskEditing
        });
        this.onShowForm();
    }
    findIndex = (id) => {
        var {tasks} = this.state;
        var result = -1;
        tasks.forEach((tasks, index) => {
                if(tasks.id === id){
                    result = index;
                }
        });
        return result;
    }
    onFilter = (filterName,filterStatus) => {
        filterStatus = parseInt(filterStatus,10);
        this.setState({
            filter : {
                name: filterName.toLowerCase(),
                status : filterStatus
            }
        });
    }
    onSearch =(keyword) => {
        this.setState({
            keyword : keyword
        });
    }
    onSort = (sortBy,sortValue) => {
        this.setState ({
                sortBy : sortBy,
                sortValue : sortValue
        });
    }
  render() {
    var {   tasks,
            isDispalyForm,
            taskEditing , 
            filter,
            keyword,
            sortBy,
            sortValue
            } = this.state; // đây là cú pháp cs6 tương đương "var tasks = this.state.tasks"
    // đóng mở TaskForm
    if(filter){ // kiem tra thang filter có tồn tại
        if (filter.name) { // kiem tra filter.name
//     tasks = tasks.filter((task) => { 
//     return task.name.toLowerCase().indexOf(filter.name) !== -1;//filter neu khac "Tất cả"
//     });
        tasks = filter(tasks,(task) => {
                return task.name.toLowerCase().indexOf(filter.name) !== -1;      
        });
        }
        tasks = tasks.filter((task) => { 
                if (filter.status === -1) {
                    return tasks;
                }else {
                    return task.status === (filter.status === 1 ? true : false)
                }
           });
    }
    if(keyword){
         tasks = tasks.filter((task) => { 
                return task.name.toLowerCase().indexOf(keyword) !== -1;
           });
    }
    if (sortBy === 'name') {
        tasks.sort((a,b) => {
            if (a.name > b.name) return sortValue;
            else if (a.name < b.name) return -sortValue;
            else return 0;
        });
    }
    else {        
        tasks.sort((a,b) => {
            if (a.status > b.status) return -sortValue;
            else if (a.status < b.status) return sortValue;
            else return 0;
        });
    }
    var elmTaskForm = isDispalyForm ? 
                        <TaskForm 
                                onSubmit={this.onSubmit}
                                onCloseForm ={this.onCloseForm} 
                                task={taskEditing}
                            /> 
                            : '';
    return (
      <div className="container">
      <h1>Quản lí Công Việc</h1>
        <div className={ isDispalyForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''} /*taskform*/>
            {elmTaskForm}
        </div>
        <div className={ isDispalyForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                      <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick= {this.onToggleForm}
                                >
                      <span className="fa fa-plus mr-5"></span>
                      Thêm công việc</button>
                      {/*<button 
                                type="button" 
                                className="btn btn-danger ml-5" 
                                onClick={this.onGenerateData}
                                >
                      <span className="fa fa-plus mr-5"></span>
                      Generate Data</button>*/}

              {/*phần search and sort*/}
              <Control 
                        onSearch= {this.onSearch}
                        onSort={this.onSort}
                        sortBy ={sortBy}
                        sortValue={sortValue}
                        />
          <div className="row mt-15">
        {/*phan list*/}         
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" /* phan table */>
                       <TaskList   tasks={ tasks } /*thực hiện hiển thị ra tasklist*/
                                    onUpdateStatus={this.onUpdateStatus}
                                    onDelete={this.onDelete}
                                    onUpdate={this.onUpdate}
                                    onFilter ={this.onFilter}
                                    />    
                </div>
              
          </div>
        </div>
      </div>
    );
  }
}

export default App;
