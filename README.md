# sld_bivariate_matrix
A free SLD Matrix TWO DIMENSIONS FEATURES INDICATORs styler. 
Generate your sld categorized style based on two indicators spanning 0-100% each classified in X and Y classes.

Doc:

1) Define X & Y Classes

2) Style your matrix

  * corner colors
  * border
  * labels (double click to edit cells labels, these will be added to the SLD and rendered in the legend)
  * export a PNG of the matrix

3) Define layer name and classification field name

4) Compute in QGIS the classification to match the cells code (eg. 0_0, 0_1, .. N_N)

  * eg. for 2 fields spanning 0 - 100 % using field calculator in QGIS:
    
    **concat((round( "field_1" /(100/(N-1)))), '_', (round( "field_2" /(100/(N-1)))))**

# <a href="#">Demo</a>



# Dependecies

- jQuery
- Bootstrap 4.0 (<a href='https://startbootstrap.com/themes/grayscale/'>GreyScale template</a>)
- <a href='https://github.com/adobe/spectrum-css'>Spectrum-css</a>
- <a href='https://github.com/trendct/Trendy.js/blob/master/Trendy.js'>Trendy.js</a>
- <a href='https://github.com/hongru/canvas2image/blob/master/canvas2image.js'>html2canvas.js</a>
- <a href='https://coderwall.com/p/z8uxzw/javascript-color-blender'>interpolate_colors.js</a>


