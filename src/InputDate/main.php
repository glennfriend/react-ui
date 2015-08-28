
    <div class="row">
        <div class="col-md-10">

            <div id="content"></div>

        </div>
        <div class="col-md-2">

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">相依性</h3>
                </div>
                <div class="panel-body">
                    ComboBox
                </div>
            </div>

        </div>
    </div>

    <script type="text/jsx">
        var Main = React.createClass({
            render() {
                return (
                    <div>
                        <div>
                            <InputDate name="happyDate" />
                        </div>
                    </div>
                );
            },
        });
        React.render(<Main />, document.getElementById('content'));
    </script>
