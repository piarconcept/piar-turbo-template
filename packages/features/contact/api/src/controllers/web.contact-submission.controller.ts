import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { ContactSubmissionEntity } from '@piar/domain-models';
import { CreateContactSubmissionUseCase } from '../use-cases';
import { CreateContactSubmissionDto } from '../dto';

@ApiTags('Public Contact Submissions')
@Controller('contact-submissions')
export class WebContactSubmissionController {
  constructor(
    @Inject(CreateContactSubmissionUseCase)
    private readonly createContactSubmissionUseCase: CreateContactSubmissionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiBody({ type: CreateContactSubmissionDto })
  @ApiResponse({ status: 201, description: 'Contact submission created' })
  async create(@Body() payload: CreateContactSubmissionDto): Promise<ContactSubmissionEntity> {
    return this.createContactSubmissionUseCase.execute(payload);
  }
}
