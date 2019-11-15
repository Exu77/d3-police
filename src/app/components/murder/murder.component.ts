import { Component, OnInit, Inject } from '@angular/core';
//import * as murderData from 'src/assets/murder.guardian.json';
import * as d3 from 'd3';
import { GuardiansServiceService } from '../../services/guardians-service.service';
import {
  IMurderGraph,
  IMurderCaseGuardian,
  ILink,
  INode
} from '../../services/models';
import { SimulationNodeDatum } from 'd3';
import { GuardiansFilterService } from '../../services/guardians-filter.service';
import { ILink } from '../../services/models';
import { SvgDefsService } from '../../services/svg-defs.service';

@Component({
  selector: 'app-murder',
  templateUrl: './murder.component.html',
  styleUrls: ['./murder.component.scss']
})
export class MurderComponent implements OnInit {
  public simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum>;
  public dataPost: any;
  public dataGuard: any;
  public murderNodes: any[];
  public width = 1000;
  public height = 1000;

  // https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/the-counted-police-killings-us-database
  // https://data.census.gov/cedsci/table?q=race&hidePreview=false&table=C02003&tid=ACSDT1Y2018.C02003&lastDisplayedRow=18
  // https://github.com/washingtonpost/data-police-shootings

  constructor(
    private guardiansService: GuardiansFilterService,
    private defsService: SvgDefsService
  ) {
    const forceX = d3.forceX(this.width / 4).strength(0.05);
    const forceY = d3.forceY(this.height / 4).strength(0.05);

    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id((d: any) => {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', forceX)
      .force('y', forceY);
  }

  ngOnInit() {
    console.log('const', d3.select('div.appMurderComp'));

    const context: any = d3
      .select('div.appMurderComp')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.defsService.addDefs(context);

    this.allClick();
  }

  public allClick() {
    const allNodes = this.guardiansService.getNodes();
    const allLinks = this.guardiansService.getLinks();
    this.drawMurders(allNodes, allLinks);
  }

  public lessClick() {
    const allNodes = this.guardiansService.getNodes();
    const allLinks = []; // this.guardiansService.getLinks();
    this.drawMurders(allNodes, allLinks);
  }

  private drawMurders(allNodes: INode[], allLinks: ILink[]) {
    const context = d3.select('div.appMurderComp svg');

    const link = context
      .append('g')
      .attr('class', 'link')
      .selectAll('line')
      .data(allLinks)
      .enter()
      .append('line')
      .attr('class', 'armedLink')
      .attr('fill', 'red')
      .attr('stroke', 'green')
      .attr('stroke-width', (d: ILink) => {
        return Math.sqrt(d.value);
      });

    const node = context
      .append('g')
      .attr('class', 'node murderNode')
      .selectAll('circle')
      .data(allNodes, d => d.id)
      .enter()
      .append('g');
    this.createNodeUse(node);
    this.createNodeCall(node);
    this.createNodeLabel(node);
    this.createNodeCall(node);

    const xxx = context.selectAll('svg .node circle');
    this.simulation.nodes(allNodes).on('tick', bla => {
      return this.ticked(link, node);
    });
    // simulation.nodes(nodeArmed).on('tick', () => this.ticked(link, nodeArmed));
    this.simulation.force('link').links(allLinks);

    node.append('title').text(function(d: IMurderCaseGuardian) {
      return d.name;
    });
  }

  private createNodeLabel(node) {
    node
      .append('text')
      .attr('x', '0')
      .attr('y', '0.5em')
      .text(d => d.name)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black');
  }

  private createNodeUse(node) {
    node
      .append('use')
      .attr('xlink:href', d => d.svgId)
      .attr('fill', d => d.color);
  }

  private createNodeCall(node) {
    node.call(
      d3
        .drag()
        .on('start', d => this.dragstarted(d, this.simulation))
        .on('drag', d => this.dragged(d, this.simulation))
        .on('end', d => this.dragended(d, this.simulation))
    );
  }

  private updateNodes(context: any, allNodes: INode[]) {
    const node = context
      .append('g')
      .attr('class', 'node murderNode')
      .selectAll('circle')
      .data(allNodes, d => d.id)
      .enter()
      .append('g')
      .append('use')
      .attr('xlink:href', d => d.svgId)
      .attr('fill', d => d.color)
      .call(
        d3
          .drag()
          .on('start', d => this.dragstarted(d, this.simulation))
          .on('drag', d => this.dragged(d, this.simulation))
          .on('end', d => this.dragended(d, this.simulation))
      );
    /*
    node.enter().append('circle')
      .attr('class', 'node')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .enter()
      .append('g')
      .append('use')
      .attr('xlink:href', d => d.svgId)
      .attr('fill', d => d.color)
      .call(
        d3.drag()
          .on('start', d => this.dragstarted(d, this.simulation))
          .on('drag', d => this.dragged(d, this.simulation))
          .on('end', d => this.dragended(d, this.simulation))
      );
  */
    node.on('mouseover', this.showDetails).on('mouseout', this.hideDetails);

    //node.exit().remove();
  }
  private showDetails(blup) {
    console.log('show', blup);
  }

  private hideDetails(blup) {
    //console.log('show', blup)
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
      console.log('dragended', this.simulation, d);
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

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  }
}
