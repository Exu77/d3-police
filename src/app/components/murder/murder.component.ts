import { Component, OnInit, Inject } from '@angular/core';
//import * as murderData from 'src/assets/murder.guardian.json';
import * as d3 from 'd3';
import { GuardiansServiceService } from '../../services/guardians-service.service';
import { IMurderGraph, IMurderCaseGuardian, ILink, INode } from '../../services/models';
import { SimulationNodeDatum } from 'd3';

@Component({
  selector: 'app-murder',
  templateUrl: './murder.component.html',
  styleUrls: ['./murder.component.scss']
})
export class MurderComponent implements OnInit {
  public dataPost: any;
  public dataGuard: any;
  public murderNodes: any[];
  public simulation;
  public width = 1000;
  public height = 400;
  
  // https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/the-counted-police-killings-us-database
  // https://data.census.gov/cedsci/table?q=race&hidePreview=false&table=C02003&tid=ACSDT1Y2018.C02003&lastDisplayedRow=18
  // https://github.com/washingtonpost/data-police-shootings

  constructor(  private guardiansService: GuardiansServiceService) {
    const forceX = d3.forceX(this.width / 4).strength(0.05);
    const forceY = d3.forceY(this.height / 4).strength(0.05);

    this.simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d: any) => {
      return d.id;
    }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(this.width / 2, this.height / 2))
    .force('x', forceX)
    .force('y',  forceY)
    ;
  }


  ngOnInit() {
    this.drawMurders();
  }

  private drawMurders() {
    const murderNodes = this.guardiansService.getData();
    const allLinks = this.guardiansService.getLinks();

    const xticked = this.ticked;
    const allNodes = this.guardiansService.getAllNodes();

    console.log('aaa', murderNodes, allNodes)

    const context: any = d3.select('div.appMurderComp')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'magenta')
    ;

    const link = context.append('g')
      .attr('class', 'link')
      .selectAll('line')
      .data(allLinks)
      .enter().append('line')
      .attr('class', 'armedLink')
      .attr('fill', 'red')
      .attr('stroke', 'green')
      .attr('stroke-width', (d: ILink) => {
        return Math.sqrt(d.value);
      });

    const node = context.append('g')
      .attr('class', 'node murderNode')
      .selectAll('circle')
      .data(allNodes, (d) => d.id)
      .enter()
      .append('circle')
      .attr('r', (d) => {
        return d.type === 'murder' ? 6 : 30;
      })
      .attr('fill', function(d) {
        return d.color;
      })
      .call(d3.drag()
          .on('start', (d) => this.dragstarted(d, this.simulation))
          .on('drag', (d) => this.dragged(d, this.simulation))
          .on('end', (d) => this.dragended(d, this.simulation))
      );

    const xxx = context.selectAll('svg .node circle');
      console.log('aaa',xxx)
    this.simulation.nodes(allNodes).on('tick', (bla) => {
      console.log('ticked', bla);
      return this.ticked(link, node)
    });
    // simulation.nodes(nodeArmed).on('tick', () => this.ticked(link, nodeArmed));
    this.simulation.force('link').links(allLinks);
  
    node.append('title')
      .text(function(d: IMurderCaseGuardian) {
        return d.name;
      });
  }

  private dragstarted(d: any, simulation: any) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0.3).restart();
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
      console.log('dragended', this.simulation, d)
      this.simulation.alphaTarget(0);
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
