var c1 = '#c0c0c0';
var c2 = '#c0c0c0';
var c3 = '#c0c0c0';
var c4 = '#c0c0c0';

var matrix_colors = {};

function createTable(r,c){
    
    var html_table ="<table class='matrix_table xy_axes'><tbody>";
    
    for (var i = (r-1); i > -1; i--){
        html_table+="<tr>";
        for (var j = 0; j < c; j++){
            var lbl = i.toString()+"_"+j.toString();
            html_table+="<td id='"+lbl+"' data-toggle='tooltip' title='"+lbl+"'>"+lbl+"</td>";
            matrix[i.toString()+"_"+j.toString()] = '';
        }
        html_table+="</tr>";
    }
    
    html_table+="</tbody></table>";
    
    return html_table;
}

function getStrokeOpt(){
    
    var stroke={};
    stroke['color'] = $('#stroke_color').val();
//    stroke['opacity'] = $('#stroke_opacity').val().toString();
    stroke['opacity'] = 1;
    stroke['width'] = $('#stroke_width').val().toString();    
    
    return stroke;
}

function exportSLD(){
    
    var sld_html = sld_header( $('#layer_name').val() );
    
    var r = $('#rows').val();
    var c = $('#cols').val();    
    var id_field = $('#layer_id_field_name').val();
    var stroke = getStrokeOpt();
    
//     for (var i = 0; i < r; i++){
//            for (var j = 0; j < c; j++){
//                var id_value = '0';//TODO
//                var color = 'red'; //TODO
//                sld_html+= sld_rule(i,j,id_field,id_value,color,stroke);
//            }
//        }    
    var trs = $('.matrix_table tr');
    for( var trsi = trs.length - 1; trsi>-1; trsi--){
       $(trs[trsi]).find('td').each(function(idx_col,tdi){
         //console.log(trs[trsi]);
         var id_value = tdi.id;
         var color = rgb2hex($(tdi).css("background-color"));
         var label = $(tdi).html();
         sld_html+= sld_rule(label,id_field,id_value,color,stroke);
      });
    }
//    $('.matrix_table tr').each(function(idx_tr,tri){
//       $(tri).find('td').each(function(idx_col,tdi){
//         var id_value = tdi.id;
//         var color = rgb2hex($(tdi).css("background-color"));
//         sld_html+= sld_rule(id_value,id_field,id_value,color,stroke);
//      });
//    });
    
    sld_html+= sld_footer();
    
    return sld_html;
}

$(document).ready(function(){
    
    
    $("#left_top_color, #right_top_color, #left_bottom_color, #right_bottom_color, #stroke_color").spectrum({
        color: "silver",
        showAlpha: true,
        preferredFormat: "hex",
    });
    $("#left_top_color, #right_top_color, #left_bottom_color, #right_bottom_color, #stroke_color").show();
    $("#left_top_color, #right_top_color, #left_bottom_color, #right_bottom_color, #stroke_color").val('#c0c0c0');
    
    $('#generate_matrix').click(function(){
        $('#projects').slideDown('slow');
        var r = $('#rows').val();
        var c = $('#cols').val();
        $('#matrix').html( createTable(r,c) );
        
        enableEvents();
    });
    
    $('#generate_sld').click(function(){
        var sld_output = exportSLD();
        $('#layer_id_field_name_defined').html($('#layer_id_field_name').val());
        $('#sld_output').val(sld_output);
        $('#output').slideDown('slow');    
    });
    

    
});

function enableEvents(){
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $('#stroke_color').on('propertychange change click keyup input paste',function(){
        $('.matrix_table td').css({'border-color':$(this).val()});
        console.log($(this).val());
    });

    $('#stroke_width').on('propertychange change click keyup input paste',function(){
        $('.matrix_table td').css({'border-width':$(this).val()});
        console.log($(this).val());
    });
    
    $('#left_top_color').on('propertychange change click keyup input paste',function(){
        c1 = $(this).val();
        draw_gradients(c1,c2,c3,c4);
        label_brightness();
    });

    $('#right_top_color').on('propertychange change click keyup input paste',function(){
        c2 = $(this).val();
        draw_gradients(c1,c2,c3,c4);
        label_brightness();
    });

    $('#right_bottom_color').on('propertychange change click keyup input paste',function(){
        c3 = $(this).val();
        draw_gradients(c1,c2,c3,c4);
        label_brightness();
    });

    $('#left_bottom_color').on('propertychange change click keyup input paste',function(){
        c4 = $(this).val();
        draw_gradients(c1,c2,c3,c4);
        label_brightness();
    });
    
    $('input[type="radio"]').on('change',function(){
        draw_gradients(c1,c2,c3,c4);
        label_brightness();
    });
    
    $('#layer_id_field_name_defined').click(function(){
        $('#layer_id_field_name').focus();
    });
    
    $('.matrix_table td').on('dblclick',function(){
        //var currElmModelAttr = $(this).attr('data-model-attr');
        
            var text = $(this).text();
            var input = $('<input style="min-width:100px;"/>', {
                'type': 'text',
                'value': text
                });
            
            $(this).empty();
            $(this).append(input);
            $(document).on("blur change", "input", function () {
                 setTimeout(function () {
                     var value = input.val();
                     input.replaceWith(value);
                     label_brightness();
                     setTimeout(changeTdWidth(),200); 
                 }, 100);
            });
    });
    
    
    $("#btnSave").click(function() { 
        html2canvas($("#matrix table")[0],{
            scale: 6.25, //96dpi x6 = 600dpi 
        })
        .then(function(canvas) {
            //document.body.appendChild(canvas);
            
            var ctx = canvas.getContext('2d');

                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                
            $("#img-out").empty();
            $("#img-out").append('<div id="preview"></div>');
            $("#img-out #preview").append(canvas);
            
            var link = document.createElement('a');
            link.innerHTML = '<button class="btn btn-info">download</button>';
            link.addEventListener('click', function(ev) {
                link.href = canvas.toDataURL();
                link.download = "matrix.png";
            }, false);
            $("#download-button").html(link);
            
        });
        
    });

    // $('.matrix_table td').on('change',function(){
    //   changeTdWidth(); 
    // });
    
    $('#remove-axes').on('change',function(){
       $('.matrix_table').toggleClass('xy_axes'); 
    });

}

function changeTdWidth(){
    var max_width = function(){
        var max = 0;
        $('.matrix_table td').each(function(){
          if ($(this).width() > max){
             max = $(this).width(); 
          }  
        });
        return max.toString()+'px';
    };
    
    $('.matrix_table td').css({'width':max_width()});
    $('.matrix_table td').css({'height':max_width()});
};

function label_brightness(){
    $('.matrix_table td').each(function(){
        var rgb =  $(this).css('background-color').match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        var brightness = Trendy.brightness(rgb[1],rgb[2],rgb[3]);
        if (brightness>123){
             $(this).css({'color':'black'});
        }else{
             $(this).css({'color':'white'});
        }
    })
}


function draw_gradients(c1,c2,c3,c4){
    var stepsX = parseInt($('#cols').val());
    var stepsY = parseInt($('#rows').val());
    
    var interpolateBy = $('input[name="interpolate"]:checked').val();
    
    var cg_12 = returnInterpolated(c1,c2,stepsX);
    var cg_23 = returnInterpolated(c2,c3,stepsY);
    var cg_43 = returnInterpolated(c4,c3,stepsX);
    var cg_14 = returnInterpolated(c1,c4,stepsY);
        
    //paint 1-2
        var first_row = $('.matrix_table tr:first').find('td');
        $.each(first_row,function(idx,elem){
            //console.log(elem);
            $(elem).attr('style','background-color:'+cg_12[idx]+'!important;');
            //console.log(cg_12[idx]);
            matrix_colors[elem.id] = cg_12[idx];
        });
        
    //paint 2-3
        var last_col = $('.matrix_table tr:first').find('td');
        $('table.matrix_table tr').each(function(idx,elem){
            var last_td = $(elem).find('td:last')[0];
            var id = last_td.id;
            $('#'+id).attr('style','background-color:'+cg_23[idx]+'!important;');
            matrix_colors[id] = cg_23[idx];
            //console.log(idx.toString()+' | '+cg_23[idx] +' | '+id);
        });

    //paint 4-3
        var last_row = $('.matrix_table tr:last').find('td');
        $.each(last_row,function(idx,elem){
            //console.log(elem);
            $(elem).attr('style','background-color:'+cg_43[idx]+'!important;');
            //console.log(cg_12[idx]);
            matrix_colors[elem.id] = cg_43[idx];
        });

    //paint 1-4
        var last_col = $('.matrix_table tr:last').find('td');
        $('table.matrix_table tr').each(function(idx,elem){
            var first_td = $(elem).find('td:first')[0];
            var id = first_td.id;
            $('#'+id).attr('style','background-color:'+cg_14[idx]+'!important;');
            matrix_colors[id] = cg_14[idx];
            //console.log(idx.toString()+' | '+cg_23[idx] +' | '+id);
        });
        
    if (interpolateBy=='cols'){
        alert('TODO');
    }else{
        //for each column, redos first and last chissene
        for(var c=0;c<stepsX;c++){
            var fc = rgb2hex( $( $('.matrix_table tr:first td')[c] ).css("background-color") );
            var lc = rgb2hex( $( $('.matrix_table tr:last td')[c] ).css("background-color") );
            //console.log(fc+' | '+lc);
            var cg_col = returnInterpolated(fc,lc,stepsY);
            //console.log(cg_col);

            for(var r=0;r<stepsY;r++){
                var i_td = $($('.matrix_table tr')[r]).find('td')[c];
                var id = i_td.id;
                $('#'+id).attr('style','background-color:'+cg_col[r]+'!important;');
                matrix_colors[id] = cg_col[r];
            }

        }
    }


        console.log(matrix_colors);

}

function sld_header(layer_name){
    return '<?xml version="1.0" encoding="UTF-8"?>\n\
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc">\n\
 <NamedLayer>\n\
  <se:Name>'+layer_name+'</se:Name>\n\
   <UserStyle>\n\
    <se:Name>'+layer_name+'</se:Name>\n\
     <se:FeatureTypeStyle>\n';
}

function sld_footer(){ 
    return '     </se:FeatureTypeStyle>\n\
  </UserStyle>\n\
 </NamedLayer>\n\
</StyledLayerDescriptor>';
}

function sld_rule(label,id_field,id_value,color,stroke){

    var name = label;

    var rule_html = '<se:Rule>\n\
          <se:Name>'+name+'</se:Name>\n\
          <se:Description>\n\
            <se:Title>'+name+'</se:Title>\n\
          </se:Description>\n\
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">\n\
            <ogc:PropertyIsEqualTo>\n\
              <ogc:PropertyName>'+id_field+'</ogc:PropertyName>\n\
              <ogc:Literal>'+id_value+'</ogc:Literal>\n\
            </ogc:PropertyIsEqualTo>\n\
          </ogc:Filter>\n\
          <se:PolygonSymbolizer>\n\
            <se:Fill>\n\
              <se:SvgParameter name="fill">'+color+'</se:SvgParameter>\n\
            </se:Fill>\n';
            
    if (parseFloat(stroke['width'])>0){
        rule_html+='<se:Stroke>\n\
              <se:SvgParameter name="stroke">'+stroke['color']+'</se:SvgParameter>\n\
              <se:SvgParameter name="stroke-opacity">'+stroke['opacity']+'</se:SvgParameter>\n\
              <se:SvgParameter name="stroke-width">'+stroke['width']+'</se:SvgParameter>\n\
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>\n\
            </se:Stroke>\n';
    }

    rule_html+='          </se:PolygonSymbolizer>\n\
        </se:Rule>\n';

    return rule_html;
            

}