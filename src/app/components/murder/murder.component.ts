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
import { SvgDefsService } from '../../services/svg-defs.service';
import { throwError } from 'rxjs';
import { isContext } from 'vm';

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
  public zoomContext: any;
  public force = 30;

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
      //.force('center', d3.forceCenter(this.width / 2, this.height / 2))
      // .force('charge', d3.forceManyBody().strength(-5))
      // .force('x', forceX)
      // .force('y', forceY)
      .on('tick', this.ticked);

    const zoomHandler = d3.zoom()
      .on("zoom", this.zoom_actions);
    zoomHandler(d3.select('div.appMurderComp svg'));
  }

  ngOnInit() {
    const context: any = d3
      .select('div.appMurderComp')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '-100, -100, 1200, 1200')
      .append('g')
      .attr('class', 'zoomCtx');
    
    this.zoomContext = d3.select('svg g.zoomCtx');
    context.append('g').attr('class', 'links');
    context.append('g').attr('class', 'nodes');

    this.defsService.addDefs(context);

    this.allClick();
  }

  public allClick() {
    this.force = -20;
    this.guardiansService.load();
    const allNodes = this.guardiansService.getNodes();
    const allLinks = this.guardiansService.getLinks();
    this.drawMurders(allNodes, allLinks);
  }

  public lessClick() {
    this.force = -10;
    this.guardiansService.loadRaceNormalized();
    const allNodes = this.guardiansService.getNodes();
    const allLinks = this.guardiansService.getLinks();
    this.drawMurders(allNodes, allLinks);
  }

  private drawMurders(allNodes: INode[], allLinks: ILink[]) {
    const context = this.getContext();

    const link = null;
    this.updateLinks(context, allLinks);
    this.updateNodes(context, allNodes);
    const node = context.selectAll('g.murderNode');
    this.simulation.nodes(allNodes);
    this.simulation.force('link').links(allLinks);
    node.raise();
    this.simulation
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('charge', d3.forceManyBody().strength(this.force))
    .alpha(2).restart();
    // simulation.nodes(nodeArmed).on('tick', () => this.ticked(link, nodeArmed));
    // this.simulation.force('link').links(allLinks);
  }

  private updateLinks(context: any, allLinks) {
    const link = context.selectAll('line.link').data(allLinks, d => {
      const id = d.source + '.' + d.target;
      return id;
    });
    link
      .enter()
      .append('line')
      .attr('id', d => d.target)
      .attr('class', 'link')
      .attr('fill', 'red')
      .attr('stroke', 'grey')
      .attr('stroke-width', '0.1');
    link.exit().remove();
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
      .attr('fill', d => (d.color === 'black' ? 'white' : 'black'));
  }

  private getContext() {
    return d3.select('div.appMurderComp svg g.zoomCtx');
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
    const node = context.selectAll('g.murderNode').data(allNodes, d => {
      return d.id;
    });
    node
      .enter()
      .append('g')
      .attr('class', 'murderNode')
      .append('use')
      .attr('xlink:href', d => d.svgId)
      .attr('fill', d => d.color);

    const d3Nodes = context.selectAll('g.murderNode');
    this.createNodeUse(d3Nodes);
    this.createNodeCall(d3Nodes);
    this.createNodeLabel(d3Nodes);
    this.createNodeCall(d3Nodes);

    node.exit().remove();
    d3.selectAll('g.murderNode')
      .on('mouseover', d => this.showDetails(context, d))
      .on('mouseout', d => this.hideDetails(context, d));
  }

  private showDetails(context, d) {
    const allLines = context.selectAll(`line.link`).nodes();
    allLines.map(n => {
      const elem = n as SVGLineElement;
      if (n.id === d.id) {
        elem.setAttribute('stroke', 'black');
        elem.setAttribute('stroke-width', '0.8');
      }
    });
  }

  private hideDetails(context, d) {
    const allLines = context.selectAll(`line.link`).nodes();
    allLines.map(n => {
      const elem = n as SVGLineElement;
      if (n.id === d.id) {
        elem.setAttribute('stroke', 'grey');
        elem.setAttribute('stroke-width', '0.1');
      }
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
      this.simulation.alphaTarget(0);
    }
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private ticked() {
    const node = d3.selectAll('svg g.murderNode');
    const link = d3.selectAll('svg line.link');
    link
      .attr('x1', (d: any) => {
        return d.source.x;
      })
      .attr('y1', (d: any) => {
        return d.source.y;
      })
      .attr('x2', (d: any) => {
        return d.target.x;
      })
      .attr('y2', (d: any) => {
        return d.target.y;
      });

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  private zoom_actions() {
    console.log('zooom')
      this.zoomContext.attr("transform", d3.event.transform);
  }
}
