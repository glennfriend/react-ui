'use strict';

/**
 *  Table
 *
 *      params:
 *          table: { heads: ['name','age'], rows: [] }
 *
 *      code:
 *          <ChooseTable data={this.state.table} />
 *
 */
let ChooseTable = React.createClass({

    getInitialState() {
        return this.getDefault( this.props.data );
    },

    /**
     *  當一個掛載的組件接收到新的 props 的時候被調用
     */
    componentWillReceiveProps(nextProps) {
        this.state = this.getDefault( nextProps.data );
        this.resetOther();
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------

    /**
     *  每次 "新" 產生的元件, unique id 將會不同
     */
    uniqueId: null,
    getUniqueId(prefix) {
        if ( !this.uniqueId ) {
            let s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            this.uniqueId = s4()+s4()+'-'+s4()+s4();
        }
        return prefix + this.uniqueId;
    },

    getChooseId() {
        return this.getUniqueId('table-choose-');
    },

    resetOther() {
        // clear choose
        var id = "#" + this.getChooseId();
        if ( $(id).length > 0 ) {
            $(id).val('');
        }

        //
    },

    /**
     *  取得預設值
     *  如果參數中有相同的 key, 則覆蓋該值
     */
    getDefault(params) {
        let def = {
            id: '',         // table id="?"
            headKey: '',    // by heads, 一般來說會是放置資料的主鍵 'id'
            heads: [],
            // sort: [],    // by heads
            rows: [],
            choose: true,
            chooseMultiple: true,
        };

        for (let key in def) {
            if( typeof(params[key])!=="undefined" ) {
                def[key] = params[key];
            }
        }
        return def;
    },

    validate() {
        if ( !this.state.headKey ) {
            console.log('table error: element headKey not found!');
            return false;
        }
        if( Object.prototype.toString.call( this.state.heads ) !== '[object Array]' ) {
            return false;
        }
        if( Object.prototype.toString.call( this.state.rows ) !== '[object Array]' ) {
            return false;
        }
        return true;
    },

    // --------------------------------------------------------------------------------
    // manager row click
    // --------------------------------------------------------------------------------
    rowClick: function(index) {
        let row = this.state.rows[index];
        let id = "#" + this.getChooseId();
        let value = $(id).val();
        let data = row[this.state.headKey].toString();

        if ( !this.state.chooseMultiple ) {
            $(id).val(data);
            return;
        }

        if ( !value ) {
            $(id).val(data);
        }
        else {
            let items = value.split(',');
            let find = items.indexOf(data);
            if ( -1 == find ) {
                items.push(data);
            }
            else {
                items.splice(find, 1);
            }
            value = items.join(",");
            $(id).val(value);
        }
    },

    hasRowActive: function(index) {
        let id = "#" + this.getChooseId();
        if ( $(id).length <= 0 ) {
            return false;
        }
        let row = this.state.rows[index];
        let key = row[this.state.headKey].toString();
        let value = $(id).val();
        let items = value.split(',');

        if ( -1 == items.indexOf(key) ) {
            return false;
        }
        return true;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    /**
     *  提供給外界處理 row
     */
    handleRow: function(row) {
        // custom event
        if (this.props.handleRow) {
            row = this.props.handleRow(row);
        }
        return row;
    },

    /**
     *  管理已點擊的 row 資訊
     */
    handleRowClick: function(index) {
        if ( !this.state.choose ) {
            return;
        }
        this.rowClick(index);
        this.setState({});
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        if ( !this.validate() ) {
            return false;
        }
        let chooseId  = this.getChooseId();
        let showClass = this.state.choose ? '' : 'table-striped';
        showClass     += ' table table-condensed table-bordered';
        return (
            <span>
                <p>
                    <input type="text" id={chooseId} name={chooseId} />
                </p>
                <table className={showClass}>
                    <thead>
                        {this.state.heads.map(this.renderHead)}
                    </thead>
                    <tbody>
                        {this.state.rows.map(this.renderRow)}
                    </tbody>
                </table>
            </span>
        );
    },

    renderRow: function(row, i) {
        row = this.handleRow(row);
        let data = this._sortRowByHeadToArray(row, this.state.heads);
        let color = this.hasRowActive(i) ? 'info' : '';
        return (
            <tr key={i} className={color} onClick={this.handleRowClick.bind(this,i)}>
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
