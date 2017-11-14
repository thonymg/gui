import { Component, OnInit } from '@angular/core';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {StorageService as ChannelStorageService, IChannel, ITemplate} from '../../../channel/channel.module';
import {GeneratorService} from '../../services/generator.service';

@Component({
  selector: 'app-generator-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {

  /**
   * Constructor
   *
   * @param modelStorageService
   * @param channelStorageService
   * @param generatorService
   */
  constructor(private modelStorageService: ModelStorageService,
              private channelStorageService: ChannelStorageService,
              private generatorService: GeneratorService) {
  }

  /**
   * Stored models
   *
   * @type {IModel[]}
   */
  models: IModel[] = [];
  /**
   * Stored channels
   *
   * @type {IChannel[]}
   */
  channels: IChannel[] = [];

  /**
   * Selected model
   *
   * @type {IModel}
   */
  model: IModel;
  /**
   * Selected channel
   *
   * @type {IChannel}
   */
  channel: IChannel;
  /**
   * Selected template
   *
   * @type {ITemplate}
   */
  template: ITemplate;

  /**
   * Generation results
   */
  result: string;

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Load models and channels
    Promise.all([
      this.modelStorageService.list(),
      this.channelStorageService.list()
    ]).then(([models, channels]) => {
      this.models = models;
      this.channels = channels;
    });

  }

  /**
   * Called when the use select a template
   *
   * @param $event
   */
  onTemplateChange($event) {
    // Clean results
    this.result = null;
    // Run generation
    this.generatorService.run(this.model, this.template)
      .then((result) => {
        this.result = result;
      });
  }

}