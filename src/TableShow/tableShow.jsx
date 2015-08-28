'use strict';

let TableShow = React.createClass({

    getDefaultProps: function() {
        return {
            heads: [],
            rows: [],
        };
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------

    validate() {
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
        if ( !this.validate() ) {
            return false;
        }
        return (
            <span>
                <table className="table table-condensed table-bordered table-striped">
                    <thead>
                        {this.props.heads.map(this.renderHead)}
                    </thead>
                    <tbody>
                        {this.props.rows.map(this.renderRow)}
                    </tbody>
                </table>
            </span>
        );
    },

    renderRow: function(row, i) {
        row = this.handleRow(row);
        let data = this._sortRowByHeadToArray(row, this.props.heads);
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

});
