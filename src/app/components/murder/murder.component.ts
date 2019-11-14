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

  constructor(private guardiansService: GuardiansServiceService) {
    const forceX = d3.forceX(this.width / 4).strength(0.05);
    const forceY = d3.forceY(this.height / 4).strength(0.05);

    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id((d: INode) => {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', forceX)
      .force('y', forceY);
  }

  ngOnInit() {
    this.drawMurders();
  }

  private drawMurders() {
    const murderNodes = this.guardiansService.getData();
    const allLinks = this.guardiansService.getLinks();

    const xticked = this.ticked;
    const allNodes = this.guardiansService.getAllNodes();

    console.log('aaa', murderNodes, allNodes);

    // const myimage = svg.append('image')
    // .attr('xlink:href', 'http://lorempixel.com/200/200/')
    // .attr('width', 200)
    // .attr('height', 200)

    const context: any = d3
      .select('div.appMurderComp')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'magenta');

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

    const knifeDef = d3
      .select('svg')
      .append('defs')
      .append('g')
      .attr('id', 'knife')
      .append('path')
      .attr('style', 'fill:#030104;')
      .attr(
        'd',
        `M9.043,13.852l2.582,1.728c-0.622,4.832-6.143,8.545-6.143,8.545l-2.034-1.898L9.043,13.852z
      M20.677,0l-0.039,0.584c-0.674,10.17-5.928,15.016-5.982,15.065l-0.143,0.129l-4.956-3.31l6.442-8.994
      c0.361-0.566,1.615-2.461,2.299-2.597c0.18-0.035,0.343,0.028,0.445,0.174c0.017,0.021,0.059,0.082,0.25,0.044
      c0.418-0.083,1.032-0.545,1.234-0.716L20.677,0z M19.887,1.234c-0.252,0.154-0.538,0.298-0.798,0.349
      c-0.402,0.081-0.619-0.081-0.723-0.209c-0.355,0.13-1.277,1.315-1.955,2.379l-6.153,8.587l4.202,2.806
      c0.488-0.494,2.19-2.374,3.617-5.707L18.05,9.398c0,0,0.938-3.564-0.174-3.85c-1.112-0.285-0.955-3.313,0.328-2.598
      C19.203,3.508,19.708,1.952,19.887,1.234z M8.595,13.225l4.081,2.724l0.514-0.768l-4.082-2.725L8.595,13.225z M18.66,10.554
      c0,0-0.471,1.026-0.375,1.507c0.096,0.479,0.465,0.813,0.822,0.741c0.359-0.072,0.572-0.52,0.477-0.999
      C19.489,11.322,18.66,10.554,18.66,10.554z M19.288,9.152c0,0-0.16,0.353-0.129,0.517c0.033,0.165,0.158,0.278,0.282,0.254
      c0.123-0.024,0.196-0.177,0.164-0.342S19.288,9.152,19.288,9.152z`
      );
    const pistolDef = d3
      .select('svg')
      .append('defs')
      .append('g')
      .attr('id', 'pistol')
      .attr('transform', 'scale(0.05 0.05)')
      // .append('svg')
      // .attr('height', 50)
      // .attr('width', 50)
      // .attr('viewBox', '0 0 50 50')
      // .attr('preserveAspectRatio', 'none')
      .append('path')
      .attr('style', 'fill:#030104;')
      .attr(
        'd',
        `M460.173,217.1c6.299-3.8,8.298-10.416,8.433-19.04h0.5c3.128,0,5.669-2.539,5.669-5.661v-89.541
        c0-3.133-2.541-5.658-5.669-5.658h-30.689c-5.94-4.575-12.649-8.198-19.905-10.649l1.284-2.911c1.265-2.87-0.032-6.205-2.895-7.464
        l-5.188-2.298c-2.856-1.262-6.2,0.033-7.462,2.903l-2.802,6.326c-1.665-0.118-3.339-0.197-5.028-0.197H66.546v-3.305
        c0-3.133-2.54-5.661-5.666-5.661H33.979c-3.127,0-5.658,2.528-5.658,5.661v3.305H16.519l4.286,24.55H5.664
        c-3.129,0-5.664,2.526-5.664,5.659v69.844c0,3.133,2.535,5.672,5.664,5.672h29.319l5.603,32.091H226.94
        c2.774,11.297,10.625,32.428,32.181,47.77c12.773,9.084,31.716,13.697,56.323,13.697c8.04,0,15.327-0.515,20.969-1.067
        l37.236,151.334c0.243,3.107,2.961,5.45,6.074,5.208l126.119-0.262c3.118-0.239,5.457-2.961,5.22-6.085L460.173,217.1z
         M315.449,268.013c-21.297,0-37.932-3.824-48.115-11.069c-15.815-11.262-22.728-26.594-25.662-36.235h60.525
        c-4.329,11.078-10.637,22.607-18.397,25.521c-2.198,0.818-3.305,3.272-2.482,5.463c0.635,1.71,2.255,2.758,3.973,2.758
        c0.496,0,1-0.08,1.486-0.265c11.906-4.465,19.907-20.564,24.559-33.478h10.222l11.447,46.49
        C328.064,267.647,322.013,268.013,315.449,268.013z`
      );

    // const whaterPistolDef = d3
    //   .select('svg')
    //   .append('defs')
    //   .append('g')
    //   .attr('id', 'waterpistol')
    //   .append('path')
    //   .attr('style', 'fill:#EDB311;')
    //   .attr(
    //     'd',
    //     `M378.433,222.609v44.522c0,12.295-9.966,22.261-22.261,22.261h-11.13v5.565
    //     c0,12.295-9.966,22.261-22.261,22.261H189.216c-12.295,0-22.261,9.966-22.261,22.261l-11.13,111.304
    //     c0,18.442-14.949,33.391-33.391,33.391h-33.39c-18.441,0-33.391-14.949-33.391-33.391V339.478c0-12.295-9.966-22.261-22.261-22.261
    //     h-11.13C9.966,317.217,0,307.251,0,294.957v-55.652c0-36.883,29.9-66.783,66.783-66.783h5.565C32.392,172.522,0,140.13,0,100.174
    //     l0,0c0-39.956,32.391-72.348,72.348-72.348h189.216c39.956,0,72.348,32.391,72.348,72.348l0,0c0,39.956-32.391,72.348-72.348,72.348
    //     h61.217c12.295,0,22.261,9.966,22.261,22.261v5.565h11.13C368.466,200.348,378.433,210.314,378.433,222.609z`
    //   )
    //   .attr('style', 'fill:#F7DB4F;')
    //   .attr(
    //     'd',
    //     `M333.057,89.043H0.854c5.354-34.672,35.322-61.217,71.494-61.217h189.216
    //     C297.735,27.826,327.703,54.371,333.057,89.043z`
    //   )
    //   .attr('style', 'fill:#FFFFFF;')
    //   .attr(
    //     'd',
    //     `M222.608,83.478c0,6.147-4.983,11.13-11.13,11.13H66.783c-6.147,0-11.13-4.983-11.13-11.13
    //     s4.983-11.13,11.13-11.13h144.695C217.624,72.348,222.608,77.331,222.608,83.478z M269.355,72.348h-2.226
    //     c-6.147,0-11.13,4.983-11.13,11.13s4.983,11.13,11.13,11.13h2.226c6.147,0,11.13-4.983,11.13-11.13S275.503,72.348,269.355,72.348z`
    //   )
    //   .attr('style', 'fill:#FF4800;')
    //   .attr(
    //     'd',
    //     `M289.39,306.087c0,49.099-39.944,89.043-89.043,89.043h-51.942c-6.147,0-11.13-4.983-11.13-11.13
    //     c0-6.147,4.983-11.13,11.13-11.13h51.942c36.824,0,66.783-29.959,66.783-66.783c0-6.147,4.983-11.13,11.13-11.13
    //     S289.39,299.94,289.39,306.087z`
    //   )
    //   .attr('style', 'fill:#782593;')
    //   .attr(
    //     'd',
    //     `M378.433,222.609v44.522c0,12.295-9.966,22.261-22.261,22.261h-11.13v5.565
    //     c0,12.295-9.966,22.261-22.261,22.261H189.216c-12.295,0-22.261,9.966-22.261,22.261l-11.13,111.304
    //     c0,18.442-14.949,33.391-33.391,33.391h-33.39c-18.441,0-33.391-14.949-33.391-33.391V339.478c0-12.295-9.966-22.261-22.261-22.261
    //     h-11.13C9.966,317.217,0,307.251,0,294.957v-55.652c0-36.883,29.9-66.783,66.783-66.783h255.999
    //     c12.295,0,22.261,9.966,22.261,22.261v5.565h11.13C368.466,200.348,378.433,210.314,378.433,222.609z`
    //   )
    //   .attr('style', 'fill:#934DAA;')
    //   .attr(
    //     'd',
    //     `M378.433,222.609H2.105c7.413-28.803,33.559-50.087,64.678-50.087h255.999
    //     c12.295,0,22.261,9.966,22.261,22.261v5.565h11.13C368.466,200.348,378.433,210.314,378.433,222.609z`
    //   )
    //   .attr('style', 'fill:#C92B00;')
    //   .attr(
    //     'd',
    //     `M378.433,222.609v44.522c0,12.295-9.966,22.261-22.261,22.261h-11.13v-89.043h11.13
    //     C368.466,200.348,378.433,210.314,378.433,222.609z`
    //   )
    //   .attr('style', 'fill:#A3E5BD;')
    //   .attr(
    //     'd',
    //     `M72.348,261.565L72.348,261.565c0-7.225,2.343-14.255,6.678-20.035l26.713-35.617l0,0l26.713,35.617
    //     c4.335,5.78,6.678,12.81,6.678,20.035l0,0c0,18.442-14.949,33.391-33.391,33.391l0,0C87.297,294.957,72.348,280.007,72.348,261.565z`
    //   )
    //   .attr('style', 'fill:#D9FCF5;')
    //   .attr(
    //     'd',
    //     `M89.043,261.565c0-9.22,7.475-16.696,16.696-16.696s16.696,7.475,16.696,16.696
    //     c0,9.22-7.475,16.696-16.696,16.696S89.043,270.786,89.043,261.565z`
    //   )
    //   .attr('style', 'fill:#A3E5BD;')
    //   .attr(
    //     'd',
    //     `M512,244.87c0,6.147-4.983,11.13-11.13,11.13h-2.226c-6.147,0-11.13-4.983-11.13-11.13
    //     s4.983-11.13,11.13-11.13h2.226C507.017,233.739,512,238.722,512,244.87z M456.348,233.739h-44.522
    //     c-6.147,0-11.13,4.983-11.13,11.13s4.983,11.13,11.13,11.13h44.522c6.147,0,11.13-4.983,11.13-11.13
    //     S462.495,233.739,456.348,233.739z M490.755,169.742c1.552,0,3.129-0.326,4.631-1.015l2.023-0.927
    //     c5.589-2.561,8.042-9.168,5.48-14.756c-2.561-5.587-9.167-8.042-14.756-5.48l-2.024,0.927c-5.587,2.561-8.042,9.168-5.479,14.756
    //     C482.503,167.333,486.537,169.742,490.755,169.742z M411.834,205.915c1.552,0,3.129-0.326,4.63-1.015l40.472-18.55
    //     c5.587-2.561,8.042-9.168,5.481-14.756c-2.561-5.589-9.168-8.042-14.756-5.481l-40.472,18.55c-5.587,2.561-8.042,9.168-5.481,14.756
    //     C403.581,203.506,407.615,205.915,411.834,205.915z M497.41,321.939l-2.023-0.927c-5.59-2.563-12.194-0.108-14.756,5.479
    //     c-2.561,5.589-0.108,12.195,5.479,14.756l2.024,0.927c1.504,0.689,3.08,1.015,4.631,1.015c4.218,0,8.253-2.411,10.125-6.495
    //     C505.452,331.107,502.999,324.5,497.41,321.939z M456.937,303.388l-40.472-18.55c-5.587-2.561-12.194-0.107-14.756,5.481
    //     c-2.561,5.589-0.107,12.195,5.481,14.756l40.472,18.55c1.503,0.689,3.079,1.015,4.63,1.015c4.218,0,8.253-2.411,10.125-6.496
    //     C464.978,312.556,462.525,305.949,456.937,303.388z`
    //   );

    const node = context
      .append('g')
      .attr('class', 'node murderNode')
      .selectAll('circle')
      .data(allNodes, d => d.id)
      .enter()
      .append('g')
      .append('use')
      .attr('xlink:href', d => d.svgId)
      // .attr('r', d => {
      //   return d.type === 'murder' ? 6 : 30;
      // })
      // .attr('fill', function(d) {
      //   return d.color;
      // })
      .call(
        d3
          .drag()
          .on('start', d => this.dragstarted(d, this.simulation))
          .on('drag', d => this.dragged(d, this.simulation))
          .on('end', d => this.dragended(d, this.simulation))
      );

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
    // .attr('cx', function(d: any) {
    //   return d.x;
    // })
    // .attr('cy', function(d: any) {
    //   return d.y;
    // });
  }
}
