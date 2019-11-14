import { Component, OnInit } from '@angular/core';
import { GuardiansStructService } from '../../services/guardians-struct.service';
import * as d3 from 'd3';
import { ILink } from '../../services/models';
import { race } from 'rxjs';

@Component({
  selector: 'app-murder-struct',
  templateUrl: './murder-struct.component.html',
  styleUrls: ['./murder-struct.component.scss']
})
export class MurderStructComponent implements OnInit {
  public width = 1000;
  public height = 400;

  constructor(
    private service: GuardiansStructService
  ) { }

  ngOnInit() {
    this.doInit();
  }

  private doInit() {
    const murderData = this.service.getMurderNodes();
    const raceLinks = this.service.getRaceLinks();
    const armedLinks = this.service.getArmedLinks();
    const armedData = this.service.getArmedNodes();
    const raceData = this.service.getRaceNodes();
    const mainCatData = this.service.getMainCatNodes();
    const mainCatLinks = this.service.getMainCatLinks();

    const forceX = d3.forceX(this.width / 4).strength(0.05);
    const forceY = d3.forceY(this.height / 4).strength(0.05);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => {
        return d.id;
      }))
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
 //     .force('x', forceX)
 //     .force('y',  forceY)
    ;

    const context: any = d3.select('div.appMurderComp')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'magenta')
    ;

    const links = context.append('g')
      .attr('class', 'links');

    const link = context.append('g')

    links.append('g')
      .attr('class', 'raceLinks')
      .selectAll('line')
      .data(raceLinks)
      .enter().append('line')
      .attr('class', 'raceLink')
      .attr('fill', 'red')
      .attr('stroke', 'green')
      .attr('stroke-width', (d: ILink) => {
        return Math.sqrt(d.value);
      });

    links.append('g')
      .attr('class', 'mainCatLinks')
      .selectAll('line')
      .data(mainCatLinks)
      .enter().append('line')
      .attr('stroke', 'orange')
      .attr('stroke-width', (d: ILink) => {
        return Math.sqrt(d.value);
      })
      .attr('class', 'mainCatLink');

    links.append('g')
      .attr('class', 'armedLinks')
      .selectAll('line')
      .data(armedLinks)
      .enter().append('line')
      .attr('class', 'armedLink')
      .attr('fill', 'red')
      .attr('stroke', 'blue')
      .attr('stroke-width', (d: ILink) => {
        return Math.sqrt(d.value);
      });

    const nodes = context.append('g')
      .attr('class', 'nodes');

    const murderNodes = nodes.append('g')
      .attr('class', 'murderNodes')
      .selectAll('circle')
      .data(murderData, (d) => d.id)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('fill', function(d) {
        return d.color;
      })
      .call(d3.drag()
          .on('start', (d) => this.dragstarted(d, simulation))
          .on('drag', (d) => this.dragged(d, simulation))
          .on('end', (d) => this.dragended(d, simulation))
      );

    const raceNodes = nodes.append('g')
      .attr('class', 'raceNodes')
      .selectAll('circle')
      .data(raceData, (d) => d.id)
      .enter()
      .append('circle')
      .attr('r', 12)
      .attr('fill', function(d) {
        return d.color;
      })
      .call(d3.drag()
          .on('start', (d) => this.dragstarted(d, simulation))
          .on('drag', (d) => this.dragged(d, simulation))
          .on('end', (d) => this.dragended(d, simulation))
      );

    const armedNodes = nodes.append('g')
      .attr('class', 'armedNodes')
      .selectAll('circle')
      .data(armedData, (d) => d.id)
      .enter()
      .append('circle')
      .attr('r', 12)
      .attr('fill', function(d) {
        return d.color;
      })
      .call(d3.drag()
          .on('start', (d) => this.dragstarted(d, simulation))
          .on('drag', (d) => this.dragged(d, simulation))
          .on('end', (d) => this.dragended(d, simulation))
      );

    nodes.append('g')
      .attr('class', 'mainCatNodes')
      .selectAll('circle')
      .data(mainCatData, (d) => d.id)
      .enter()
      .append('circle')
      .attr('r', 24)
      .attr('fill', 'grey')
      .call(d3.drag()
          .on('start', (d) => this.dragstarted(d, simulation))
          .on('drag', (d) => this.dragged(d, simulation))
          .on('end', (d) => this.dragended(d, simulation))
      );
    const allNodes = nodes.selectAll('svg .nodes circle');
    const allLinks = links.selectAll('svg .links line');
    const allData = [...raceData]
      .concat([...murderData])
      .concat([...mainCatData])
      .concat([...armedData]);
    //const allData = [...raceData, ...murderData, ...armedLinks, ...mainCatData];
    const allLinkData = [...raceLinks]
      .concat([...mainCatLinks])
      .concat([...armedLinks]);
    console.log('allData', allData);

    simulation.nodes(allData).on('tick', (bla) => {
      console.log('ticked', bla);
      return this.ticked(allLinks, allNodes)
    });

    simulation.force('link').links(allLinkData);
}

  private dragstarted(d: any, simulation: any) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(d: any, simulation: any) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private dragended(d: any, simulation: any) {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
  
  private ticked(link, node) {
    link
      .attr('x1', function(d: any) {
        return d.source.x;
      })
      .attr('y1', function(d: any) {
        return d.source.y;
      })
      .attr('x2', function(d: any) {
        return d.target.x;
      })
      .attr('y2', function(d: any) {
        return d.target.y;
      });

    node
      .attr('cx', function(d: any) {
        return d.x;
      })
      .attr('cy', function(d: any) {
        return d.y;
      });
  }
}
