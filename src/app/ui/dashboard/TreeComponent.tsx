import { init, getInstanceByDom } from "echarts";
import { useEffect, useRef, type CSSProperties } from "react";
import type { ECharts, SetOptionOpts } from "echarts";
import { FunctionElement } from "@/utility/Interfaces";
import { setLabelColors, updateParentColors } from "@/utility/TreeHelper";

export interface ReactEChartsProps {
  data: any[]; // Modify this type according to the structure of your data
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
  data_size? : number,
  handleOpenDialog,
  applyColors: boolean,
}

//echarts component for displaying the data as a tree
export function ReactECharts({
  style,
  settings,
  applyColors,
  loading,
  theme,
  data,
  data_size,
  handleOpenDialog,
}: ReactEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);


  const processedData = applyColors ? data.map(rootNode => updateParentColors(setLabelColors(rootNode))) : data;



  const option = {
		//trigger the tooltip when the mouse hovers the label
    tooltip: {
      trigger: "axis",
      triggerOn: "mousemove",
    },
		//define how to display the data in the tree
    series: [
      {
        scale: true,
        move: true,
        type: 'tree',
        id: 0,
        name: 'tree1',
        data: processedData,
        height: "auto",
        width: "auto",
        top: '6%',
        left: '3%',
        bottom: '3%',
        right: '27%',
        symbolSize: 9,
        edgeForkPosition: '80%',
        initialTreeDepth: 3,
        lineStyle: {
          width: 0.5,
        },  
        label: {
          backgroundColor: "#ffffff",
          position: 'right',
          verticalAlign: 'middle', // Ensures the label is vertically aligned
          align: 'left', // Aligns the text to the left
          fontSize: 11,
          margin: 20, // Adjust this for the distance between node and label
          triggerEvent: true,
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
          },
					//what happens when you hover on a leave label 
          emphasis: {
            focus: 'ancestor',
          },
        },
				//what happens when you hover on a parent label label 
        emphasis: {
          focus: 'descendant',
        },
        expandAndCollapse: true,
        animationDuration: 100,
        animationDurationUpdate: 100,
      },
    ],
  };
  
  

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme, {width:1200, height:1700});
    }

    

    // Add chart resize listener
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
   if (chartRef.current !== null) {
      let chart = getInstanceByDom(chartRef.current);
      
      
      //keep the height of the tree between two selected values
      if(data_size!=undefined){

        if (data_size<100){
          data_size = 100;
        }
        else if (data_size>1600){
          data_size = 1600;
        }
        option.series[0].height = data_size?.toString();
        chart?.setOption(option)
				
				//handleOpenDialog when the user clicks on the element with lowest level = true (to view the information about it)
        chart?.on('click', params => {
          if ((params as any).data?.lowestLevel == true) {
            handleOpenDialog((params as any).data.id);
          }
        });
      }
    } 
  }, [data, settings, theme]);

  const chartStyle: CSSProperties = {
    display: "flex",
    width: "auto",
    overflow: "auto", // or overflow-x: scroll
    ...style,
  };


  return <div ref={chartRef} style={chartStyle}></div>;
}

