import React, { Component } from 'react';
class TaskForm extends Component {
  constructor(props){
      super(props);
      this.state = {
            id : '',
            name : '',
            status : true
      }
  }
  componentWillMount(){ // chi dc sd 1 lan nen ko dc goi lai khi click vao cac sua cac task khac
      if(this.props.task){
        this.setState({
              id : this.props.task.id,
              name : this.props.task.name,
              status : this.props.task.status
        });
      }
  }
  componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.task){
        this.setState({
              id : nextProps.task.id,
              name : nextProps.task.name,
              status : nextProps.task.status
       });
      } else if (!nextProps.task) {
              this.setState({
                 id : '',
                 name : '',
                 status : false
              });
                }
  }
  onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
            if (name === 'status'){
                value = target.value === 'true' ? true : false;
            } 
        this.setState({
            [name] : value
        });
  }
  onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state);
        //cancel & close form
        this.onClear();
        this.onCloseForm();

  }
  onCloseForm = () => {
        this.props.onCloseForm();
  }
  onClear = () => {
        this.setState({
            name : '',
            status : false
        });
  }

  render() {
      var { id } = this.state;
    return (
              <div className="panel panel-primary">
              <div className="panel-heading">
                  <h3 className="panel-title">
                {/* nếu đã có "id"  thì cập nhật , neesud chưa có thì thêm mới*/}
                  { id !== '' ? 'Cập nhật công việc' : 'Thêm công việc' }
                    <span 
                          className="fa fa-times-circle text-right"
                          onClick ={this.onCloseForm}
                          >
                    </span>
              </h3>

            </div>
            <div className="panel-body">
            <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                            <label >Tên:</label>
                            <input 
                                  type="text" 
                                  className="form-control" 
                                  name = "name"
                                  value = {this.state.name}
                                  onChange ={this.onChange}
                                  />
                      </div>
                      <div className="form-group">
                            <label >Trạng thái:</label>
                            <select 
                                  className="form-control"
                                  name = "name"
                                  value = {this.state.status}
                                  onChange ={this.onChange}
                                   >
                              <option value={true}>  Kích hoạt </option>
                              <option value={false}> Ẩn </option>
                            </select>
                      </div>
                         <button 
                                type="submit" 
                                className="btn btn-warning"
                                >
                         <span className="fa fa-plus mr-5"></span>
                         Lưu lại</button> &nbsp;
                         <button 
                                type="submit" 
                                className="btn btn-danger"
                                onClick = {this.onClear}
                                >
                          <span className="fa fa-close mr-5"></span>
                         Hủy bỏ</button>

            </form>
            </div>
          </div>
    );
  }
}

export default TaskForm;
