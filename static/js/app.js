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
                                .replace('{name}', 'Prompt')
                                .replace('{code}', highlighted_code)
                                .replace('{link}', codegen_file);
            $(html_code).appendTo("#" + id);
         }, 'text');

        var codegen_file = './static/tasks/' + domain_name + '/' + 'response.txt';
        $.get(codegen_file, function(data) {
            var highlighted_code = hljs.highlight(data, {language: 'python'}).value;
            var html_code = codegen_html_template
                                .replace('{name}', 'GPT-4 Output')
                                .replace('{code}', highlighted_code)
                                .replace('{link}', codegen_file);
            $(html_code).appendTo("#" + id);
         }, 'text');
    });

    var current_domain = "faucet"

    $('select').on('change', function() {
        var domain_name = this.value
        var current_content = $('#content_' + current_domain);
        current_content.hide();

        var desired_content = $('#content_' + domain_name);
        desired_content.show();

        // set current to desired
        current_domain = domain_name;
    });
});