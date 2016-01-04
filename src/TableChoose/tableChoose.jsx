'use strict';

let ui = ui || {};
ui.TableChoose = React.createClass({

    /**
     *  只掛載第一次 (?)
     *  順序
     *      getDefaultProps()
     *      getInitialState()
     *      componentDidMount()
     */
    getDefaultProps: function() {
        return {
            headKey: '',    // by heads, 一般來說會是放置資料的主鍵 example 'id' 'email'
            heads: [],
            rows: [],
         // sort: [],       // by heads
        };
    },
    /**
     *  取得該 component 預設值
     */
    getInitialState() {
        return {
            saveCheckbox: {},       // 儲存 checkbox item
            saveControlCheckbox: 0, // 控制 checkbox all 的功能, 並以圖示表示狀態
        };
    },
    /**
     *  在掛載結束之後馬上被調用
     *  DOM init in here
     */
    componentDidMount() {
        this.resetAllCheckbox();
    },

    /**
     *  已掛載的組件接收到新的 props 被調用
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.props = nextProps;
        }
        this.state.saveCheckbox        = this.getInitialState().saveCheckbox;
        this.state.saveControlCheckbox = this.getInitialState().saveControlCheckbox;
        this.resetAllCheckbox();
    },

    /**
     *  每次更新都調用
     */
    componentDidUpdate() {
    },

    // --------------------------------------------------------------------------------
    // item checkbox store
    // --------------------------------------------------------------------------------
    /**
     *  manager checkbox
     */
    getCheckbox( key, defaultValue ) {
        key = key.toString();
        if( typeof(this.state.saveCheckbox[key.toString()]) == "undefined" ) {
            return defaultValue ? defaultValue : null;
        }
        return this.state.saveCheckbox[key.toString()];
    },

    setCheckbox( key, value ) {
        key = key.toString();
        let originValue = this.getCheckbox(key);

        this.state.saveCheckbox[key.toString()] = value;
        this.setState({saveCheckbox: this.state.saveCheckbox});
        this.updateControlIcon();

        // 供外部使用的 listenCheck 是否有建立
        if ( !this.props.listenCheck ) {
            return;
        }
        // 如果值無改變, 不會觸發外部 event
        if ( originValue === value ) {
            return;
        }
        // 如果值原本是 null, 將不會觸發, 所以在新建立參數時, 不會觸發 event
        if ( null === originValue ) {
            return;
        }
        this.props.listenCheck(key, value);
    },

    /**
     *  將所有 rows 的 checkbox 設定為 false
     */
    resetAllCheckbox()
    {
        let headKey = this.props.headKey;
        let that = this;
        let key;
        utils.each( this.props.rows, function(index, obj) {
            key = obj[headKey];
            that.setCheckbox(key, false);
        });
    },

    getAllCheckbox() {
        return this.state.saveCheckbox;
    },

    /**
     *  row checkbox 是否 全部都選
     */
    isAllCheck() {
        if ( !this.state.saveCheckbox ) {
            return false;
        }
        let result = true;
        utils.each( this.state.saveCheckbox, function(key, value) {
            if ( value !== true ) {
                result = false;
                return false; // is break
            }
        });
        return result;
    },

    /**
     *  row checkbox 是否 全部沒有選
     */
    isAllNotCheck() {
        if ( !this.state.saveCheckbox ) {
            return false;
        }
        let result = true;
        utils.each( this.state.saveCheckbox, function(key, value) {
            if ( value !== false ) {
                result = false;
                return false; // is break
            }
        });
        return result;
    },

    // --------------------------------------------------------------------------------
    // control checkbox store
    // --------------------------------------------------------------------------------
    /**
     *  get control checkbox icon
     *
     *  0 沒有任何點擊  的圖示  -> 囗
     *  1 部份點擊      的圖示  -> 囗 + 一
     *  2 全點擊圖      的圖示  -> 囗 + Ｖ
     *
     */
    getControlClassName()
    {
        switch ( this.state.saveControlCheckbox ) {
            case 1:  return 'fa fa-lg fa-minus-square-o';
            case 2:  return 'fa fa-lg fa-check-square';
            default: return 'fa fa-lg fa-square-o';
        }
    },

    /**
     *  依照現在 item checkbox 的狀態, 改變 control icon 
     */
    updateControlIcon()
    {
        if ( this.isAllCheck() ) {
            this.state.saveControlCheckbox = 2;
        }
        else if ( this.isAllNotCheck() ) {
            this.state.saveControlCheckbox = 0;
        }
        else {
            this.state.saveControlCheckbox = 1;
        }
        this.setState({saveControlCheckbox: this.state.saveControlCheckbox});
    },

    /**
     *  依照現在 control icon 的狀態, 在點擊該 icon 之後
     *  必須對 item checkbox 做狀態的變更
     *
     *  0 沒有任何點擊  的圖示 -> 2 全選取
     *  1 部份點擊      的圖示 -> 0 全取消
     *  2 全點擊圖      的圖示 -> 0 全取消
     *
     *  @return boolean
     */
    clickControlIcon()
    {
        let control;
        switch ( this.state.saveControlCheckbox ) {
            case 1:
            case 2:
                this.state.saveControlCheckbox = 0;
                control = false;
                break;
            default:
                this.state.saveControlCheckbox = 2;
                control = true;
        }
        this.setState({saveControlCheckbox: this.state.saveControlCheckbox});

        let that = this;
        utils.each( this.getAllCheckbox(), function(key, value) {
            that.setCheckbox( key, control );
        });
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    getRowKey(index)
    {
        if ( !this.props.rows[index] ) {
            return null;
        }
        return this.props.rows[index][this.props.headKey].toString();
    },

    /**
     *  引用者所需要的資訊
     */
    getInfo() {
        let numChoose = 0;
        utils.each( this.getAllCheckbox(), function(key, value) {
            if ( value === true ) {
                numChoose++;
            }
        });
        return {
            numChoose: numChoose,
            chooseItems: this.getAllCheckbox(),
        };
    },

    validate() {
        if ( !this.props.headKey ) {
            console.log('table error: element headKey not found!');
            return false;
        }
        if( Object.prototype.toString.call( this.props.heads ) !== '[object Array]' ) {
            return false;
        }
        if( Object.prototype.toString.call( this.props.rows ) !== '[object Array]' ) {
            return false;
        }
        return true;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    /**
     *  管理點擊的 row 資訊
     */
    handleCheck: function(key, event) {
        this.setCheckbox(key, event.target.checked);
    },

    handleCheckAll: function() {
        this.clickControlIcon();
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        if ( !this.validate() ) {
            return false;
        }
        let style = {
            "width": "20px"
        };

        let icon = this.getControlClassName();
        return (
            <span>
                <table className="table table-condensed table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={style}>
                                <i className={icon} onClick={this.handleCheckAll}></i>
                            </th>
                            {this.props.heads.map(this.renderHead)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.rows.map(this.renderRow)}
                    </tbody>
                </table>
            </span>
        );
    },

    renderRow: function(row, i) {
        let key     = this.getRowKey(i);
        let data    = this._sortRowByHeadToArray(row, this.props.heads);
        let color   = this.getCheckbox(key) ? 'info' : '';
        return (
            <tr key={i} className={color}>
                <td><input
                        type="checkbox"
                        key={i}
                        onChange={this.handleCheck.bind(this,key)}
                        checked={this.getCheckbox(key)} /></td>
                {data.map(this.renderCell)}
            </tr>
        );
    },

    renderCell: function(data, i) {
        return (
            <td key={i}>{data}</td>
        );
    },

    renderHead: function(title, i) {
        title = title.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        return (
            <th key={i}>{title}</th>
        );
    },

    /**
     *  將 row object 重新依照 head 排序, 並且轉成 "二維陣列"
     *  注意, 是轉為二維陣列!
     *
     *      {name:'ken', age:20, birth:'2000-01-01'}
     *      ->
     *          [
     *              ['ken'],
     *              [20],
     *              ['2000-01-01']
     *          ]
     *
     *  @return Array
     */
    _sortRowByHeadToArray: function( row, heads )
    {
        let data = [];
        let index = 0;
        for ( let idx in heads ) {
            let name = heads[idx];
            data[index++] = [ row[name] ];
        }
        return data;
    },

});
