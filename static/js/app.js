$(document).ready(function() {
        var codegen_html_template = `
    <p>{name}</p>
    <pre class="codegen"><code class="language-python">{code}</code></pre>`;
    $('[id^="code_"]').each(function() {
        var id = this.id;
        var domain_name = id.substring(5);
        var codegen_file = './static/tasks/' + domain_name + '/' + 'prompt.txt';

        $.get(codegen_file, function(data) {
            var highlighted_code = hljs.highlight(data, {language: 'python'}).value;
            var html_code = codegen_html_template
                                .replace('{name}', 'Input Prompt')
                                .replace('{code}', highlighted_code)
                                .replace('{link}', codegen_file);
            $(html_code).appendTo("#" + id);
         }, 'text');

        var codegen_file = './static/tasks/' + domain_name + '/' + 'response.txt';
        $.get(codegen_file, function(data) {
            var highlighted_code = hljs.highlight(data, {language: 'python'}).value;
            var html_code = codegen_html_template
                                .replace('{name}', 'LLM Output')
                                .replace('{code}', highlighted_code)
                                .replace('{link}', codegen_file);
            $(html_code).appendTo("#" + id);
         }, 'text');
    });

    // var current_cmd_idxs = {
    //     "faucet": 1
    // }

    var current_domain = "faucet"

    var vid_start_times = {
        "faucet": 0
    }

    var vid_end_times = {
        "faucet": 5
    }

    function playSeg(vid, start_time, end_time, domain_name) {
        vid.play();
        vid.pause();
        vid.currentTime = start_time;
        vid.play();

        // console.log("start and end: " + start_time.toString() + ", " + end_time.toString());

        var pausing_function = function() {
            // console.log("checking pausing function cb for " + domain_name);
            // console.log("current and end time");
            // console.log(this.currentTime);
            // console.log(end_time)
            if (this.currentTime >= end_time) {
                // console.log("reached end time");
                this.pause();
                this.removeEventListener("timeupdate", pausing_function);
            }
        };

        // console.log("adding timeupdate pausing_function for " + domain_name + "_" + desired_cmd_idx.toString());
        vid.addEventListener("timeupdate", pausing_function);
    }

    $('select').on('change', function() {
        // var sep_idx = this.value.indexOf('_'); 
        // var domain_name = this.value.substring(0, sep_idx);
        // var desired_cmd_idx = parseInt(this.value.substring(sep_idx + 1)); 
        // var current_cmd_idx = current_cmd_idxs[domain_name]; 

        var domain_name = this.value
        var current_content = $('#content_' + current_domain);
        current_content.hide();

        var desired_content = $('#content_' + domain_name);
        desired_content.show();

        var vid = $("#vid_" + domain_name);
        var start_time = vid_start_times[domain_name];
        var end_time = vid_end_times[domain_name];
        playSeg(vid, start_time, end_time, domain_name);

        // set current to desired
        current_domain = domain_name;
    });
});