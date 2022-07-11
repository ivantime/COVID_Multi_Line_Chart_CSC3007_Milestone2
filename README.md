# covid_multi_line_chart_CSC3007_milestone2

<br>
<br>
<li>
<h2> Original Graph From John Hopkins University @ https://www.bloomberg.com/graphics/2020-coronavirus-cases-world-map/#cases-since</h2>
</li>
<br>
<u><b>
Logs:
</u></b>
<ul>
<li>
7 July 2022 - Completed (Python) Jupyter Notebook to reform CSVs from John Hopkins University (JHU) Git Commit URL @ https://github.com/CSSEGISandData/COVID-19/tree/1731460b0c53554f38c6422cc47c1a5b2b1f638c/csse_covid_19_data/csse_covid_19_daily_reports into 1 json file (data.json)
<ul>
<li>
<b>
Added to Repo:
</b>
<ul>
<li>
'csvs' Folder with CSVs from JHU
</li>
<li>
'data.json' containing all Dates from CSV Consisting of Country Names, Confirmed Cases, Deaths Reported (per Country)
</li>
</ul>
</ul>
</ul>
<ul>
<li>
8 July 2022 (Update 1) - Added to (Python) Jupyter Notebook to transform CSV previously compiled of Country World Regions @ https://meta.wikimedia.org/wiki/List_of_countries_by_regional_classification into 1 json file (country_regions.json)
</li>
<ul>
<li>
<b>
Added to Repo:
</b>
<ul>
<li>
'country_regions.json' containing Dictionary of Country Regions consisting of the Respective Countries Within them
</li>
</ul>
</li>
</ul>
</ul>

<ul>
<li>
8 July 2022 (Update 2) - Added JS Base Code Work (Axis,Color Scale,etc before plotting of line charts) with final(tentative) data transformation using JS (i.e. combining/mapping world regions with Country's Dataset Stats into 1 usable dataset for plotting with the JSON data type
</li>
<ul>
<li>
<b>
Temp Changes to Repo <i>(For Testing)</i>:
</b>
<ul>
<li>
Current "data" Folder Contain Subset of Entire Country Stats Dataset for Testing Purposes. Complete (Cleaned) Country's Stats Dataset found in 'data.zip' containing Previously combined JSON datasets (country_regions,country_data)
</li>
</ul>
</li>
</ul>
</ul>


<ul>
<li>
10 July 2022 - Re-Transformed 'country_regions.json' and 'country_data.json' via Updated Jupyter Notebook Code Work. All Country Lines drawn (on 1st Chart for All Countries) via JS and HTML with Drawing Animations.
</li>
<ul>
<li>
<b>
Repo Changes:
</b>
<ul>
<li>
Updated "data" Folder Containing Entire Country Stats ('country_regions.json','country_data.json') Dataset, removed Testing Dataset.
</li>
<li>
Updated Jupyter Notebook Code Work for Removing Empty Countries/World-Regions
</li>
</ul>
</li>
</ul>
</ul>


<ul>
<li>
11 July 2022 - Updated script.js by Adding a Table (legend) for all Countries graph. By Hovering Over/Out on Legend that Country would be highlighted within the graph (while the remaining Countries are diminished in the Background). Opactity was set to 0
as with opacity>0 results in the respectively dim colors to still overtake the perception of the bright but low contrast colours of specifically selected lines/Countries".
</li>
</ul>

</ul>
<br>
<br>
<br>
<br>
