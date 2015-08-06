'use strict';
var Sg = Sg || {};

/**
 *  Table
 *
 *      params:
 *          table: { heads: ['name','age'], rows: [] }
 *
 *      code:
 *          <Sg.Table data={this.state.table} />
 *
 */
Sg.Table = React.createClass({

    getInitialState() {
        return this.getDefault( this.props.data );
    },

    componentWillReceiveProps(nextProps) {
        this.state = this.getDefault( nextProps.data );
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    /**
     *  取得預設值
     *  如果參數中有相同的 key, 則覆蓋該值
     */
    getDefault(params) {
        let def = {
            heads: [],
            rows: [],
            // sort: [],    // allow by heads
            // checkbox: false,
            // multiple: false,
        };

        for (let key in def) {
            if( typeof(params[key])!=="undefined" ) {
                def[key] = params[key];
            }
        }
        return def;
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

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {

        if( Object.prototype.toString.call( this.state.heads ) !== '[object Array]' ) {
            return;
        }
        if( Object.prototype.toString.call( this.state.rows ) !== '[object Array]' ) {
            return;
        }
        return (
            <table className="table table-striped table-condensed table-bordered">
                <thead>
                    {this.state.heads.map(this.renderHead)}
                </thead>
                <tbody>
                    {this.state.rows.map(this.renderRow)}
                </tbody>
            </table>
        );
    },

    renderRow: function(row, i) {
        row = this.handleRow(row);
        let data = this._sortRowByHeadToArray(row, this.state.heads);
        return (
            <tr key={i}>
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

    /**
     *  將 object 轉換為 二維陣列
     *
     *      {name:'ken', age:20}
     *      ->
     *          [
     *              ['name', 'ken']
     *              ['age', 20]
     *          ]
     *
     */
    /*
    _objectToFlatArray: function( obj ) {
        let arr = [];
        let index = 0;
        for ( let key in obj ) {
            arr[index++] = [key, obj[key]];
        }
        return arr;
    },
    */

});
