import { Component, OnInit } from '@angular/core';
import { GuardiansFilterService } from '../../services/guardians-filter.service';
import { INode, ILink } from '../../services/models';
import * as d3 from 'd3';
import { Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3';

@Component({
  selector: 'app-murder-filter',
  templateUrl: './murder-filter.component.html',
  styleUrls: ['./murder-filter.component.scss']
})
export class MurderFilterComponent implements OnInit {
  public width = 1000;
  public height = 1000;
  public simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum>;

  constructor(
    private service: GuardiansFilterService,
  ) {
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => {
        return d.id;
      }))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      //.force('x', d3.forceX().x(d => d.x).strength(0.03))
      //.force('y', d3.forceY().y(d => d.y).strength(0.03))
      .force('charge', d3.forceManyBody().strength(-20))
      //.force("collide",d3.forceCollide().radius(d => d.r * 550))
      //.force('x', forceX)
      //.force('y',  forceY)
    ;
  }

  ngOnInit() {
    this.draw(this.service.getNodes(), this.service.getLinks());
  }

  public draw(nodes: INode[], links: ILink[]) {

    const context: any = d3.select('div.appMurderComp')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'magenta')
    ;

    const d3Links = context.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('class', 'raceLink')
    .attr('fill', 'red')
    .attr('stroke', 'gray')
    .attr('stroke-width', (d: ILink) => {
      return Math.sqrt(1);
    });

    const d3Nodes = context.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes, (d) => d.id)
      .enter()
      .append('circle')
      .attr('r', (d) => {
        if (d.type === 'murder') {
          return 3;
        }
        return 30;
      })
      .attr('fill', function(d) {
        return d.color;
      })
      .call(d3.drag()
          .on('start', (d) => this.dragstarted(d, this.simulation))
          .on('drag', (d) => this.dragged(d, this.simulation))
          .on('end', (d) => this.dragended(d, this.simulation))
      );

    this.simulation.nodes(nodes);
    this.simulation.on('tick', this.ticked)
      // .charge(-200)
      //.linkDistance(50)
    this.simulation.force('link').links(links);
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
  
  private ticked() {
    console.log('ticked')
    const node = d3.selectAll('svg .nodes circle');
    const link = d3.selectAll('svg .links line');
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
